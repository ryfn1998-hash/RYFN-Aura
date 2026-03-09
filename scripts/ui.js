import { world, system } from "@minecraft/server";

// 介面狀態管理
export const UI_State = {
    showMenu: false,
    modules: [
        { name: "自動攻擊 (1打10)", state: true },
        { name: "不死之身 (自動圖騰)", state: true },
        { name: "穿牆模式 (Noclip)", state: false },
        { name: "顯示玩家血量 (ESP)", state: true }
    ]
};

// 模擬一個中文懸浮選單 (每隔 2 秒提示一次狀態)
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        let menuContent = "§l§b[ RYFN ULTIMATE 選單 ]§r\n";
        UI_State.modules.forEach(m => {
            const status = m.state ? "§a[已開啟]" : "§c[已關閉]";
            menuContent += `§f> ${m.name}: ${status}\n`;
        });
        
        // 只有當玩家在潛行時顯示選單 (模擬按鈕開啟)
        if (player.isSneaking) {
            player.onScreenDisplay.setTitle(menuContent);
        }
    }
}, 40);
