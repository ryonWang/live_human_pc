use tauri::Manager;
use std::process::Command;
#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;
use tauri::AppHandle;

#[cfg(target_os = "windows")]
const CREATE_NO_WINDOW: u32 = 0x08000000;

#[tauri::command]
fn get_docker_mount_path(app_handle: AppHandle) -> String {
    let data_dir = app_handle.path()
        .app_data_dir()
        .expect("Failed to get app data dir")
        .join("data");  // 添加 "data" 子目录以匹配 Docker 挂载路径
    data_dir.to_string_lossy().replace("\\", "/")
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_docker_mount_path])  // 添加命令处理器
        .plugin(tauri_plugin_single_instance::init(
            |app_handle, argv, cwd| {
                println!("Trying to launch another instance with args: {:?}", argv);
                // "main" 要与 tauri.conf.json 中的 label 匹配
                let _ = app_handle
                    .get_webview_window("main")
                    .expect("no main window")
                    .set_focus();
            },
        ))
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_upload::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
