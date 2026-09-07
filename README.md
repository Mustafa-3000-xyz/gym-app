مقدمه
--
فكرة المشروع هو عمل نظام للجيمات لإدارة المتدربين وإنشاء حسابات داخل التطبيق ومعرفة الارباح والمصروفات وعرض كل الايام التي حضر فيها المتدربون وتخصيص بعض الإعدادات داخل التطبيق ..
ويتكون البرنامج من عددة صفحات وهم كالاتي :
1. **صفحة المتدربين** 
2. **صفحة الحسابات**
3. **صفحة تسجيل الحضور**
4. **صفحة الارباح والمصروفات**
5. **صفحة الإعدادات**
6. **صفحة شرح البرنامج**
---
الاوامر
--
لكي تقوم بتشغيل البرنامج بشكل الصحيح, يجب إتٌباع تلك الخطوات :
1. **الخطوه الاولى**
يجب ان نقوم بتنزيل لغة Rust على الجهاز لأن مكتبة Tauri تعتمد على لغة Rust, لكي نقوم بتنزيل لغة Rust, يجب ان تعرف ما هو نظام التشغيل الذي تستخدمه, إذا كنت تستخدم نظام Linux او Mac قم بفتح Terminal واكتب هذا الامر :
```
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```
إذا كنت تستخدم نظام ويندوز, قم بالتوجه الى الموقع الخاص بالغة Rust :
https://www.rust-lang.org/tools/install 
وقم بتحميل ملف rustup , بعد إنتهاء التحميل قم بالضغط على الملف وسوف يفتح مع CMD, قم بتباع خطوات التنزيل, بعد الإنتهاء تأكد بإن لغة RUST تم تثبيتها على الجهاز عن طريق ذلك الامر:
```
rustc --version
```
إذا ظهر معك اصدار اللغه, هذا يعني ان عملية التثبيت تمت بنجاح.
2. **الخطوه الثانيه**
يوجد بعض الحزم والادوات التي يجب ان نقوم بتنزيلها على الجهاز, تلك الحزم والادوات طريقة تنزيلها تختلف من نظام تشغيل للاخر, إذا كنت من مستخدمين نظام لنكس تحديدا توزيعة Debian او اي توزيعة مبنيه على Debian قم بكتابة تلك الاوامر في Terminal :
```
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```
إذا كنت تستخدم اي توزيعه اخرى, قم بالذهاب الي ذلك الرابط :
https://v2.tauri.app/start/prerequisites/#system-dependencies
وقم بختيار التوزيعه التي تستخدمها ومن ثم خذ الاوامر التي موجوده وضعها في Terminal.
وإن كنت من مستخدمين الويندوز, قم بتحميل Microsoft C++ Build Tools من خلال ذلك الرابط :
https://visualstudio.microsoft.com/visual-cpp-build-tools/
بعد ذلك افتح البرنامج واختار ++Desktop development with C وتابع عملية التحميل.
3. **الخطوه الثالثه**
يجب ان تقوم بتنزيل المكتبات التي تستخدم داخل المشروع وفي تلك الخطوه يجب ان تقوم بتحميل Node js على الجهاز, إذا لم تُنزل Node js من قبل على الجهاز, توجه الى الموقع الخاص ب Node js وتابع خطوات التحميل :
https://nodejs.org/en
بعد التحميل, تأكد بأن Node js تم تنزيله على الجهاز عن طريق ذلك الامر :
```
node -v
npm -v
```
إذا ظهر معك الاصدار, هذا يعني ان عملية التثبيت تمت بنجاح.
الخطوه الاخيره وهي بأن نقوم بتنزيل المكتبات, توجه الى Folder المشروع ومن ثم قم بكتابة ذلك الامر في Terminal :
```
npm install
```
4. **الخطوه الرابع**
هنشغل المشروع عن طريق الامر ده :
```
npm run tauri dev
```
وإذا اردت بأن تقوم بعمل Build للمشروع, سوف تكتب ذلك الامر :
```
npm run tauri build
```
وإذا اردت تشغيل البرنامج بعد عملية Build, اتبع ذلك المسار :
```
src-tauri/
	target/
		release/
			gym-app <= This app
```
ملحوظه : التطبيق الخارج من عملية Build سوف يشتغل على نظام التشيغل الذي تم فيه عملية Build, على سبيل المثال, إذا كنت تستخدم نظام لنكس وقمت بعملية Build, التطبيق سوف يعمل فقط في نظام لنكس.









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