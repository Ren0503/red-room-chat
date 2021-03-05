export default {
    getInitialsFromName: (username) => {
        const letters = String(username)
            .split(" ")
            .map((i) => i.charAt(0))
        return letters.join("")
    },
}
