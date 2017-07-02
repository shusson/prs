import { Injectable } from '@angular/core';

const protocol = 'http';
const host = 'localhost';
const port = '4000';
const dbName = 'mapd';
const user = 'mapd';
const pwd = 'HyperInteractive';

@Injectable()
export class MapdService {
    session = null;

    constructor() {
    }

    connect(): Promise<any> {
        return new Promise((resolve, reject) => {
            new MapdCon()
                .protocol([protocol])
                .host([host])
                .port([port])
                .dbName([dbName])
                .user([user])
                .password([pwd])
                .connect((error, session) => {
                    if (error) {
                        reject(error);
                    } else {
                        this.session = session;
                        resolve(session);
                    }
                });
        });
    }

}
