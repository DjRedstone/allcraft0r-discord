$.ajax({
    type: "GET",
    url: "leaderboard",
    success: res => {
        let i = 1;
        for (const data of res) {
            const money = data.money;
            const uuid = data.uuid;
            $("#leaderboard-grid").append(`<div class="leaderboard-card">
                                <h1>${i}</h1>
                                <img src="#">
                                <span>${uuid}</span>
                                <span>${money}</span>
                            </div>`)
            i += 1
        }
    }
});