import { Injectable, EventEmitter } from "@angular/core";
import { AppRepository } from "../repositories/app.repository";
import { ignoreElements } from "rxjs/operators";
const CLIENT_ID = "584574268984-ia9hs8a653a8p4q23duqob501a5f3fgq.apps.googleusercontent.com";
const API_KEY = "AIzaSyADt_kqAFO0hcQ1wKY2jw20LMjDVKc8flo";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
var SCOPES = 'https://www.googleapis.com/auth/drive';

@Injectable()
export class GapiSession {
    googleAuth: gapi.auth2.GoogleAuth;

    constructor(
        private appRepository: AppRepository

    ) {
    }

    initClient() {
        return new Promise((resolve,reject)=>{

            gapi.load('client:auth2', () => {
                return gapi.client.init({
                    apiKey: API_KEY,
                    clientId: CLIENT_ID,
                    discoveryDocs: DISCOVERY_DOCS,
                    scope: SCOPES,
                    // @ts-ignore
                    redirect_uri: 'http://localhost:4200'
                }).then(() => {                   
                    this.googleAuth = gapi.auth2.getAuthInstance();
                    resolve();
                });
            });
        });
        
    }

    get isSignedIn(): boolean {
        return this.googleAuth.isSignedIn.get();
    }

    signIn() {

        // let options = new gapi.auth2.SigninOptionsBuilder();
        // options.setFetchBasicProfile(true);
        // options.setPrompt('consent');
        // options.redirect_uri()

        return this.googleAuth.signIn({
            prompt: 'consent'
        }).then((googleUser: gapi.auth2.GoogleUser) => {
            this.appRepository.User.add(googleUser.getBasicProfile());
        });
    }

    signOut(): void {
        this.googleAuth.signOut();
    }
}