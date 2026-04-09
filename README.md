مقدمه
--
---
npm run tauri dev

npm run tauri build => for build projeect and the reaslt is app work in your operating system

npm run build => for build website and run

  

-Note: Write these commands in tirmenal not vs code

  

<!--

If you are using linux (Ubuntu), so download these tools and packages for run app after build in window only

-->

  

sudo apt update

sudo dpkg --add-architecture i386

sudo apt install wine64 wine32

sudo apt install -y mingw-w64 binutils

sudo apt install nsis

cargo install tauri-cli

rustup target add x86_64-pc-windows-gnu

  

<!-- This command make build to project and run app in windows -->

cargo tauri build --target x86_64-pc-windows-gnu

  

<!-- This command for run virtual box -->

sudo modprobe -r kvm_intel



test