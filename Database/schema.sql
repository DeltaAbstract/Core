CREATE TABLE IF NOT EXISTS Guilds (
  guildId VARCHAR(100) NOT NULL PRIMARY KEY,
  prefix VARCHAR(100) DEFAULT '!',
  lang VARCHAR(100) DEFAULT 'en',
  commandsused VARCHAR(100) DEFAULT '0',
  welcome TEXT NOT NULL, -- JSON object containing settings for welcome (channel, message)
  leave TEXT NOT NULL, -- JSON object containing settings for leave (channel, message)
  roles TEXT NOT NULL, -- JSON object containing role IDs 
  logging TEXT NOT NULL, -- JSON object containing IDs for the channels
  blacklisted TEXT NOT NULL, -- JSON object containing arrays of blacklisted roles, users etc...
  disableditems TEXT NOT NULL, -- JSON object containing arrays of blacklisted commands  / categories
  moderations TEXT NOT NULL, -- JSON array containing objects of moderations 
  protected TEXT NOT NULL,
  ranks TEXT NOT NULL,
  tags TEXT NOT NULL,
  notes TEXT NOT NULL
);
