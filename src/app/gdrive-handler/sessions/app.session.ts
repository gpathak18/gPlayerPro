import { Injectable } from "@angular/core";
import { UserSession } from "./user.session";
import { GapiSession } from "./gapi.session";
import { FileSession } from "./file.session";

@Injectable()
export class AppSession {
    constructor(
        private authSession: GapiSession,
        private fileSession: FileSession,
        private userSession: UserSession
    ) {

    }

    get File():FileSession {
        return this.fileSession;
    }
    get Gapi(): GapiSession {
        return this.authSession;
    }

    get User(): UserSession {
        return this.userSession;
    }


}