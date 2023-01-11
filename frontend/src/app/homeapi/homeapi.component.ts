
import { Component, NgModule, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../service/authentication/authentication.service';
import { BackendService } from '../service/shared/backend.service';

@Component({
	selector: 'ngbd-table-basic',
	templateUrl: './homeapi.component.html',
	styleUrls: ['./homeapi.component.css']
})


export class HomeapiComponent implements OnInit {
	public formData = new FormData();
	public appId = '';
	public assetIds = [];
	public deviceId=''
	isLoading=false;

	public project: { iconUrl: string, id: string, title: string, userId: string }[] = [];
	public devices: { deviceId: string, deviceName: string, deviceStatus: string }[] = [];

	onFileSelected(event: any) {
		const formData: File = <File>event.target.files[0]
		console.log(event);
		if (this.formData.has(event.target.name)) {
			this.formData.delete(event.target.name)
		}
		if (formData) {
			this.formData.append(event.target.name, formData)
		}

	}
	onSelectingApplication(event: any) {
		this.appId = event.detail[0];
		console.log("Event",this.appId);
	}
	onSelectingAssets(event: any) {
		console.log("Event",event);
		this.assetIds = event.detail;
	}
	onSelectingDevice(event: any) {
		console.log("Device ID",event.detail[0]);
		this.deviceId = event.detail[0];
	}

	constructor(public authenticationService: AuthenticationService, private http: HttpClient, private backendService: BackendService) {

		// function to list available project and properties on login to home page

		this.backendService.projectList().subscribe((res: any) => {
			this.project = res;
			console.log("Project List Response", res);

		});

		// function to list available devices and properties on login to home page

		this.backendService.deviceList().subscribe((res: any) => {
			this.devices = res;
			console.log("Device List response", res);

		});


	}
	ngOnInit(): void { }

	async deployToIed() {
		this.isLoading=true;
		console.log('Device ID', this.assetIds);
		console.log('FORM', this.formData);
		let flowFilePath = '';
		
		if (this.formData.has('iedFlowFile')) {
			const formData = new FormData();
			formData.append('files', this.formData.get('iedFlowFile') as FormDataEntryValue)
			flowFilePath = await this.fileUpload(formData);
		}
		this.backendService.deployFlowToDevice(this.assetIds, flowFilePath).subscribe((res: any) => { console.log(res); this.isLoading=false; })


	}

	// Upload application function 
	async deployToIem() {
		this.isLoading=true; 
		console.log('Application ID', this.appId);
		console.log('FORM', this.formData);
		let flowFilePath = '';
		if (this.formData.has('iemFlowFile')) {
			const formData = new FormData();
			formData.append('files', this.formData.get('iemFlowFile') as FormDataEntryValue)
			flowFilePath = await this.fileUpload(formData);
		}
		this.backendService.projectUpload(this.appId, '', flowFilePath).subscribe((res: any) => { console.log(res); this.isLoading=false })
	}


	async deployFlowApptoIem() {
		this.isLoading=true;
		console.log('Device ID', this.deviceId);
		console.log('FORM', this.formData);
	
		this.backendService.flowAppUpload(this.appId,this.deviceId,this.authenticationService.getUrl()).subscribe((res: any) => { console.log(res); this.isLoading=false });


	}


	private fileUpload(formData: FormData): Promise<string> {
		return new Promise((resolve, reject) => {
			this.backendService.fileUpload(formData).subscribe((res: any) => { resolve(res.filePath) })
		})
	}
	// appUploadEvent() {
	// 	console.log("Appupload form credentials", this.authenticationService.getUrl(), this.authenticationService.getPassword(), this.authenticationService.getUsername())

	// };

}




