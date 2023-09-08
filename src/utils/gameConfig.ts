const GAME_CONFIG: { chessBorder: number, winCount: number }[] = [
    // 井字棋配置(默认配置)
    {
        chessBorder: 3,
        winCount: 3,
    },
    // 五子棋配置
    {
        chessBorder: 15,
        winCount: 5,
    },
];
export default GAME_CONFIG;
