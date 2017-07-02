import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable()
export class MapdService {
    session = null;

    constructor() {
    }

    connect(): Promise<any> {
        return new Promise((resolve, reject) => {
            new MapdCon()
                .protocol([environment.protocol])
                .host([environment.host])
                .port([environment.port])
                .dbName([environment.dbName])
                .user([environment.user])
                .password([environment.pwd])
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
