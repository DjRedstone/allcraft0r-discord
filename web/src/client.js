$.ajax({
    type: "GET",
    url: "/leaderboard",
    success: async res => {
        let i = 1;
        for (const data of res) {
            const money = data.money;
            const uuid = data.uuid;
            const user = await $.ajax({
                type: "GET",
                url: `/discordUser?id=${uuid}`
            });
            const elt = $(`
            <tr>
                <th class="center aligned">${i}</th>
                <td class="center aligned">
                    <img class="ui avatar image" src="${user.avatarURL}">
                    ${user.tag}
                </td>
                <th class="center aligned">${money}</th>
            </tr>
            `);
            if (user.avatarURL === null) {
                elt.find("td:nth-child(2)").html(`
                <i class="user circle icon"></i>
                ${user.tag}
                `);
            }
            $("#leaderboard-body").append(elt);
            i += 1
        }
    }
});