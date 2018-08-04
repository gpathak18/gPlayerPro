import {Track} from './track';

export class Album {

    private _id: string;
	private Name: string;
	private AlbumName: string;
	private DocType: string = "Album";
    private ImageUrl: string;
    private Link: string;
	private Source: string;
	private Tracks: Array<Track>
	private CompatibleSources: string
    private Selection: string = "closed";
    private IndexZ: string = "zClose";

    constructor(name: string){
        this.Name = name;
        this.AlbumName = name;
    }

	public get indexz(): string {
		return this.IndexZ;
	}

	public set indexz(value: string) {
		this.IndexZ = value;
	}

	public get selection(): string {
		return this.Selection;
	}

	public set selection(value: string) {
		this.Selection = value;
	}
	
	public get tracks(): Array<Track> {
		return this.Tracks;
	}

	public set tracks(value: Array<Track>) {
		this.Tracks = value;
	}

	public get id(): string {
		return this._id;
	}

	public set id(value: string) {
		this._id = value;
	}

	public get name(): string {
		return this.Name;
	}

	public set name(value: string) {
		this.Name = value;
	}

	public get imageUrl(): string {
		return this.ImageUrl;
	}

	public set imageUrl(value: string) {
		this.ImageUrl = value;
	}

	public get link(): string {
		return this.Link;
	}

	public set link(value: string) {
		this.Link = value;
	}

	public get source(): string {
		return this.Source;
	}

	public set source(value: string) {
		this.Source = value;
    }
 
}
