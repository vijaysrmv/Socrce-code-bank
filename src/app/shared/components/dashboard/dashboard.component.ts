import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { PageLoaderService } from "../../../core/components/page-loader/page-loader.service";

@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
	isExpanded = false;

	appStatusData = [
		{ name: "Completed", value: 34 },
		{ name: "Declined", value: 7 },
		{ name: "Pending Customer Response", value: 15 },
		{ name: "Pending Signature and Funding", value: 70 },
		{ name: "Withdrawn", value: 5 },
	];

	appStagesData = [
		{ name: "Received", value: 330 },
		{ name: "Completed", value: 120 },
		{ name: "DocuSign", value: 50 },
		{ name: "Deferred", value: 15 },
	];

	appAnalyticsData = [
		{ name: "Landing Page", value: 27 },
		{ name: "Disclosure Page", value: 21 },
		{ name: "Error Page", value: 7 },
		{ name: "Personal Details", value: 6 },
		{ name: "Select Product", value: 4 },
		{ name: "Account Funding Page", value: 3 },
		{ name: "Business Landing Page", value: 3 },
		{ name: "Success Page", value: 1 },
		{ name: "Track App Page", value: 1 },
		{ name: "Questionnaire Page", value: 1 },
	];

	pendingDocs = [
		{
			id: 1,
			docType: "Articles of Incorporation",
			fileName: "",
			isAttached: false,
		},
		{
			id: 2,
			docType: "Certificate of Qualification",
			fileName: "",
			isAttached: false,
		},
	];

	constructor(private pageLoaderSvc: PageLoaderService, private router: Router) {}

	ngOnInit() {
		this.pageLoaderSvc.hide();
	}

	onAppTypeClick() {
		this.pageLoaderSvc.show(true, false);

		setTimeout(() => {
			this.pageLoaderSvc.hide();
			this.isExpanded = true;
		}, 1000);
	}

	handleContinue() {
		sessionStorage.setItem("arn", "2E05B22D-DD79-43EC-AA31-DF957AF86109");
		this.router.navigate(["business-deposit/review"]);
	}

	uploadAttachment(event: any, docId: number): void {
		const selectedFile = event.target.files[0];
		this.updatePendingDoc(docId, true, selectedFile.name);

		// this.result = "File Name: " + selectedFile.name;
		// this.result += "<br>File Size(byte): " + selectedFile.size;
		// this.result += "<br>File Type: " + selectedFile.type;
	}

	removeAttachment(docId: number) {
		this.updatePendingDoc(docId, false);
	}

	private updatePendingDoc(docId: number, decision: boolean, fileName?: string) {
		const selectedDoc = this.pendingDocs.find((d) => d.id === docId);
		if (selectedDoc) {
			selectedDoc.isAttached = decision;
			selectedDoc.fileName = decision ? fileName : "";
		}
	}
}
