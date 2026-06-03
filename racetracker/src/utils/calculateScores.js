export function calculateScores(data) {
    const scores = {}

    data.players.forEach(player => {
        scores[player.code] = {
            name: player.name,
            code: player.code,
            points: 0
        }
    })

    const pointsMap = [4, 3, 2, 1]

    ;(data.rounds || []).forEach(round => {
        const result = round.results || ""

        result.split("").forEach((code, index) => {
            if (scores[code]) {
                scores[code].points += pointsMap[index] || 0
            }
        })
    })

    return Object.values(scores)
}