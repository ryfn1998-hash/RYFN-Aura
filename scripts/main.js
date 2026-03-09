import { world, system, EntityDamageCause } from "@minecraft/server";

// --- RYFN 科技公司：功能配置區 ---
const Settings = {
    aura: true,       // 1打10開關
    auraRange: 8,     // 攻擊距離
    autoTotem: true,  // 自動換圖騰
    godMode: false    // 實驗性無敵
};

// 核心循環：每 0.05 秒檢查一次周圍
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (!Settings.aura) continue;

        // 搜尋周圍實體
        const entities = player.dimension.getEntities({
            location: player.location,
            maxDistance: Settings.auraRange,
            excludeNames: [player.name]
        });

        // 執行 1 打 10 邏輯
        let count = 0;
        for (const entity of entities) {
            if (count >= 10) break; 
            
            // 模擬攻擊封包
            entity.applyDamage(8, {
                cause: EntityDamageCause.entityAttack,
                damagingEntity: player
            });
            
            // 中文提示
            player.onScreenDisplay.setActionBar("§b[RYFN] §f正在鎖定目標: §e" + count);
            count++;
        }
    }
}, 1);

// 自動防禦模組
world.afterEvents.entityHurt.subscribe((event) => {
    if (Settings.autoTotem && event.hurtEntity.typeId === "minecraft:player") {
        // 當血量過低，發送中文警告
        event.hurtEntity.sendMessage("§l§c[警報] §f自動更換圖騰模組已啟動！");
    }
});
// 在循環中加入
target.nameTag = `§cHP: ${Math.floor(target.getComponent("health").currentValue)}`;
