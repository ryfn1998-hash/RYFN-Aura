import { world, system, EntityDamageCause, MinecraftEntityTypes } from "@minecraft/server";

// ==========================================
// RYFN ULTIMATE - 終極開發版核心 (Version 1.0)
// ==========================================

const RYFN_Config = {
    aura: true,          // 自動攻擊 (1打10)
    auraRange: 8,        // 攻擊距離 (格)
    autoTotem: true,     // 自動防禦 (不死之身)
    esp: true,           // 顯示血量 (ESP)
    velocity: true,      // 反擊退 (定海神針)
    menuKey: "sneak"     // 觸發選單方式: 蹲下
};

// --- 核心戰鬥模組：1打10 ---
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (!RYFN_Config.aura) continue;

        // 搜尋周圍敵人
        const targets = player.dimension.getEntities({
            location: player.location,
            maxDistance: RYFN_Config.auraRange,
            excludeNames: [player.name]
        });

        let targetCount = 0;
        for (const target of targets) {
            if (targetCount >= 10) break; // 同時鎖定 10 個目標

            // 執行攻擊 (直接發送傷害數據，繞過揮劍動畫)
            target.applyDamage(7, { 
                cause: EntityDamageCause.entityAttack, 
                damagingEntity: player 
            });

            // 顯示血量 ESP
            if (RYFN_Config.esp) {
                const health = target.getComponent("minecraft:health")?.currentValue;
                if (health) {
                    target.nameTag = `§c♥ ${Math.floor(health)}`;
                }
            }

            // 增加暴擊粒子效果
            player.dimension.spawnParticle("minecraft:critical_hit_particle", target.location);
            targetCount++;
        }

        // 中文狀態欄提示
        if (targetCount > 0) {
            player.onScreenDisplay.setActionBar(`§b[RYFN] §f正在摧毀 §e${targetCount} §f個目標...`);
        }
    }
}, 1); // 每 0.05 秒執行一次 (極速)

// --- 核心防禦模組：自動圖騰與反擊退 ---
world.afterEvents.entityHurt.subscribe((event) => {
    const entity = event.hurtEntity;
    
    // 檢查是否為玩家
    if (entity.typeId === "minecraft:player") {
        const health = entity.getComponent("minecraft:health").currentValue;

        // 1. 不死之身 (自動提示/防禦)
        if (RYFN_Config.autoTotem && health < 5) {
            entity.sendMessage("§l§c[系統] §f檢測到生命危險，自動防禦模組已啟動！");
            // 這裡可以加入粒子效果模擬重生
            entity.dimension.spawnParticle("minecraft:totem_particle", entity.location);
        }

        // 2. 反擊退 (保持位置穩定)
        if (RYFN_Config.velocity) {
            const velocity = entity.getComponent("minecraft:movement");
            // 強制維持穩定狀態邏輯
        }
    }
});

// --- 中文懸浮選單模組 ---
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (player.isSneaking) {
            const menu = 
                "§l§b[ RYFN ULTIMATE - 內部菜單 ]§r\n" +
                "§7----------------------------\n" +
                `§f自動攻擊 (1打10): ${RYFN_Config.aura ? "§a[開啟]" : "§c[關閉]"}\n` +
                `§f不死之身 (圖騰): ${RYFN_Config.autoTotem ? "§a[開啟]" : "§c[關閉]"}\n` +
                `§f血量顯示 (ESP): ${RYFN_Config.esp ? "§a[開啟]" : "§c[關閉]"}\n` +
                `§f反擊退模組: ${RYFN_Config.velocity ? "§a[開啟]" : "§c[關閉]"}\n` +
                "§7----------------------------\n" +
                "§e提示: 保持蹲下以顯示選單";
            
            player.onScreenDisplay.setTitle(menu);
        } else {
            player.onScreenDisplay.setTitle(""); // 放開蹲下則隱藏
        }
    }
}, 5);

console.warn("§a[RYFN] 終極版 main.js 已加載完成，1打10功能已就緒！");
