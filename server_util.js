class MongoConnection {
    constructor(prefix, suffix) {
        this.prefix = prefix;
        this.suffix = suffix;
    }

    connectionString(dbname) {
        return this.prefix + dbname + this.suffix;
    }
}

module.exports = MongoConnection;