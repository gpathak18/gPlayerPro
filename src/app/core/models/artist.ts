export class Artist {

    private Id: string;
    private Name: string;
    private ImageUrl: string;
    private Link: string;
    private Source: string;
    private CompatibleSources: string

    constructor(name: string){

        this.Name = name;

    }

	public get id(): string {
		return this.Id;
	}

	public set id(value: string) {
		this.Id = value;
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
