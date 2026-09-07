use std::fs::{self, File};
use std::io::{Read, Write};
use std::path::PathBuf;
use std::process::Command;
use serde_json::{json, Value};
use sha2::{Digest, Sha256};
use tauri::{AppHandle, Manager};
use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm, Nonce
};
// ========================================================== //
// 1. تشفير وفك تشفير البيانات (AES-256-GCM)
// ========================================================== //
fn encrypt_data(plain_text: &str, hwid: &str) -> Result<Vec<u8>, String> {
    let mut hasher = Sha256::new();
    hasher.update(hwid.as_bytes());
    let key_bytes = hasher.finalize();

    let cipher = Aes256Gcm::new_from_slice(&key_bytes)
        .map_err(|_| "فشل إنشاء مفتاح التشفير".to_string())?;

    // استخدام try_into للتحويل الآمن لتفادي التحذير
    let nonce_bytes: &[u8; 12] = b"unique_nonce";
    let nonce = Nonce::from(*nonce_bytes);

    cipher
        .encrypt(&nonce, plain_text.as_bytes())
        .map_err(|_| "فشل تشفير بيانات التكوين".to_string())
}

fn decrypt_data(encrypted_data: &[u8], hwid: &str) -> Result<String, String> {
    let mut hasher = Sha256::new();
    hasher.update(hwid.as_bytes());
    let key_bytes = hasher.finalize();

    let cipher = Aes256Gcm::new_from_slice(&key_bytes)
        .map_err(|_| "فشل إنشاء مفتاح التشفير".to_string())?;

    let nonce_bytes: &[u8; 12] = b"unique_nonce";
    let nonce = Nonce::from(*nonce_bytes);

    let decrypted_bytes = cipher
        .decrypt(&nonce, encrypted_data)
        .map_err(|_| "الملف غير تابع لهذا الجهاز أو تم التلاعب به!".to_string())?;

    String::from_utf8(decrypted_bytes).map_err(|e| e.to_string())
}
// ========================================================== //
// 2. استخراج معرّفات الجهاز (Hardware IDs) ومسار الملف
// ========================================================== //
fn get_motherboard_id() -> Result<String, String> {
    if cfg!(target_os = "windows") {
        let output = Command::new("wmic")
            .args(["baseboard", "get", "serialnumber"])
            .output()
            .or_else(|_| {
                Command::new("powershell")
                    .args(["-Command", "Get-CimInstance Win32_BaseBoard | Select-Object -ExpandProperty SerialNumber"])
                    .output()
            })
            .map_err(|e| e.to_string())?;

        let serial = String::from_utf8_lossy(&output.stdout);
        let clean_serial = serial.lines().skip(1).collect::<Vec<&str>>().join("").trim().to_string();

        if clean_serial.is_empty() {
            Err("NO_BOARD_SERIAL".into())
        } else {
            Ok(clean_serial)
        }
    } else if cfg!(target_os = "linux") {
        let output = Command::new("cat")
            .arg("/sys/class/dmi/id/board_serial")
            .output()
            .map_err(|e| e.to_string())?;

        let serial = String::from_utf8_lossy(&output.stdout).trim().to_string();

        if serial.is_empty() || serial.contains("Permission denied") {
            Err("NO_BOARD_SERIAL".into())
        } else {
            Ok(serial)
        }
    } else {
        Err("UNSUPPORTED_OS".into())
    }
}

fn get_machine_id() -> String {
    if cfg!(target_os = "windows") {
        let output = Command::new("cmd")
            .args(["/C", "reg query HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Crypto /v MachineGuid"])
            .output();

        if let Ok(out) = output {
            let str_out = String::from_utf8_lossy(&out.stdout);
            if let Some(guid) = str_out.split_whitespace().last() {
                return guid.to_string();
            }
        }
    } else if cfg!(target_os = "linux") {
        if let Ok(id) = std::fs::read_to_string("/etc/machine-id") {
            return id.trim().to_string();
        }
    }
    "UNKNOWN_MACHINE_ID".to_string()
}

fn get_procedures_file_path(app: &AppHandle) -> Result<PathBuf, String> {
    let mut path = app
        .path()
        .app_local_data_dir()
        .map_err(|e| e.to_string())?;

    if !path.exists() {
        fs::create_dir_all(&path).map_err(|e| e.to_string())?;
    }

    path.push("procedures-gym-app.json");
    Ok(path)
}
// ========================================================== //
// 3. TAURI COMMANDS
// ========================================================== //
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn generate_hwid() -> String {
    let board_id = get_motherboard_id().unwrap_or_else(|_| "NO_BOARD_ID".to_string());
    let machine_id = get_machine_id();
    let os_name = std::env::consts::OS;

    let raw_hwid = format!("{}:{}:{}", board_id, machine_id, os_name);

    let mut hasher = Sha256::new();
    hasher.update(raw_hwid.as_bytes());

    let hash_result = hasher.finalize();
    hash_result.iter().map(|b| format!("{:02x}", b)).collect()
}

#[tauri::command]
fn manage_gym_procedures(app: AppHandle, new_data: Option<Value>) -> Result<Value, String> {
    let file_path = get_procedures_file_path(&app)?;
    let current_hwid = generate_hwid();

    if !file_path.exists() {
        let initial_data = new_data.unwrap_or_else(|| json!({
            "testInfo": {
                "isTest": false,
                "endDate": null,
                "activationDate": null
            },
            "licenseKey": null
        }));

        let json_string = initial_data.to_string();
        let encrypted_bytes = encrypt_data(&json_string, &current_hwid)?;

        let mut file = File::create(&file_path).map_err(|e| e.to_string())?;
        file.write_all(&encrypted_bytes).map_err(|e| e.to_string())?;

        Ok(json!({
            "status": "created",
            "path": file_path.to_str(),
            "data": initial_data
        }))
    } 
    else {
        let mut file = File::open(&file_path).map_err(|e| e.to_string())?;
        let mut encrypted_content = Vec::new();
        file.read_to_end(&mut encrypted_content).map_err(|e| e.to_string())?;

        let decrypted_json_str = decrypt_data(&encrypted_content, &current_hwid)?;
        let mut json_data: Value = serde_json::from_str(&decrypted_json_str).unwrap_or(json!({}));

        if let Some(incoming_data) = new_data {
            if let Some(obj) = json_data.as_object_mut() {
                if let Some(new_obj) = incoming_data.as_object() {
                    for (k, v) in new_obj {
                        obj.insert(k.clone(), v.clone());
                    }
                }
            }
            let updated_encrypted_bytes = encrypt_data(&json_data.to_string(), &current_hwid)?;
            let mut file = File::create(&file_path).map_err(|e| e.to_string())?;
            file.write_all(&updated_encrypted_bytes).map_err(|e| e.to_string())?;
        }

        Ok(json!({
            "status": "updated",
            "path": file_path.to_str(),
            "data": json_data
        }))
    }
}
// ========================================================== //
// 4. RUN METHOD
// ========================================================== //
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            generate_hwid,
            manage_gym_procedures
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}