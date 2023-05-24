class Room {
    // The constructor is called when a new instance of Room is created.
    // The number, challengeSets and timeLimit are passed in when the new Room is created.
    constructor(number, challengeSets) {
        this.number = number;  // The room number
        this.challengeSets = challengeSets;
        this.scenario = 'path/to/scenario/image.png' // Array of ChallengeSet objects, where each ChallengeSet represents the challenges for a particular planet
        this.npc = 'path/to/npc/image.png';  // The path to the image file for the room's NPC
    }

    static createRooms() {
        // Create two rooms
        let room1 = new Room(1, generateChallengeSetsForRoom());
        let room2 = new Room(2, generateChallengeSetsForRoom());

        return [room1, room2];
    }
    
    // This method is used to add a ChallengeSet to this room
    addChallengeSet(challengeSet) {
        this.challengeSets.push(challengeSet);
    }

    // This method is used to calculate the progress of this room.
    // It works by calculating the total number of challenges and the number of correctly answered challenges,
    // and then it calculates the percentage of completed challenges.
    getProgress() {
        const totalChallenges = this.challengeSets
            .map(challengeSet => Object.values(challengeSet.challenges).flat()) // For each ChallengeSet, it gets the array of challenges and flattens them into a single array
            .flat().length;  // Counts the total number of challenges

        const completedChallenges = this.challengeSets
            .map(challengeSet => Object.values(challengeSet.challenges)
                .flat()
                .filter(challenge => challenge.isAnsweredCorrectly))  // For each ChallengeSet, it gets the array of challenges, flattens them, and then filters only the correctly answered challenges
            .flat().length;  // Counts the number of correctly answered challenges

        return completedChallenges / totalChallenges * 100;  // Calculates the progress as a percentage
    }
}
