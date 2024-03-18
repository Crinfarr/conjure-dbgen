import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import https from 'https';

    /**
     * I LOVE IIFEs I LOVE IIFEs I LOVE IIFEs
     */
    (async () => {
        const db = await open({
            driver: sqlite3.Database,
            filename: 'carddb.db'
        });

        await db.exec('PRAGMA journal_mode=WAL;');
        await db.exec(/*sql*/`
            CREATE TABLE cards (
                name: TEXT NOT NULL,
                mana: TEXT NOT NULL,
                typeline: TEXT NOT NULL,
                oracle: TEXT,
                corner: TEXT,
                face: TEXT
            );
        `);

        let allcards: Array<{}>;
        await new Promise<null>((resolve, reject) => {
            let bulkURL = ''
            https.get('https://api.scryfall.com/bulk-data/27bf3214-1271-490b-bdfe-c0be6c23d02e', (res) => {
                let data = '';
                res.on('data', (d) => data += d);
                res.on('end', () => {
                    bulkURL = JSON.parse(data).download_uri;
                });
            }).on('close', () => {
                https.get(bulkURL, (res) => {
                    let restext = '';
                    res.on('data', (d) => restext += d);
                    res.on('end', () => {
                        allcards = JSON.parse(restext);
                        resolve(null);
                    })
                });
            });
        });
        allcards!.forEach(async (card) => {
            await db.exec('INSERT INTO cards (name, ')
        });
    })();