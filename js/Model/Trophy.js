class Trophy {
    constructor(name, description, icon = null) {
        this.name = name;
        this.description = description;
        // ?????
        this.earned = false; // By default, a new trophy has not been earned.
        this.icon = icon; // Optional icon property
    }

    // Method to earn the trophy
    earn() {
        this.earned = true;
    }
}
