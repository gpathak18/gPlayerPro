import { Track } from './track';

export class Playlist implements Playlist {

	private TrackCount: Number = 0;
	private UserIsOwner = true;
	private IsHidden = false;
	private CollectionStateToken?: string;
	private Tracks: Array<Track> = new Array<Track>();
	private _id: string;
	private Name: string;
	private ImageUrl?: string;
	private Link?: string;
	private Source?: string;
	private CompatibleSources?: string;

	constructor(name: string) {
		this._id = name;
		this.name = name;
	}

	public get trackCount(): Number {
		return this.TrackCount;
	}

	public get tracks(): Array<Track> {
		return this.Tracks;
	}

	public set tracks(value: Array<Track>) {
		this.Tracks = value;
	}

	public get name(): string {
		return this.Name;
	}

	public set name(value: string) {
		this.Name = value;
	}

	public get link(): string {
		return this.Link;
	}

	public set link(value: string) {
		this.Link = value;
	}
	public set trackCount(value: Number) {
		this.TrackCount = value;
	}

	public get isHidden(): boolean {
		return this.IsHidden;
	}

	public set isHidden(value: boolean) {
		this.IsHidden = value;
	}

	public get userIsOwner(): boolean {
		return this.UserIsOwner;
	}

	public set userIsOwner(value: boolean) {
		this.UserIsOwner = value;
	}
}
