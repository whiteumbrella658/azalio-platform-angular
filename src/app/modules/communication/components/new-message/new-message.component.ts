import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../../core/services/firestore.service';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { ApiService } from '../../../../core/http/api.service';
import { DataSharedService } from 'src/app/core/services/data-shared.service';

@Component({
	selector: 'app-new-message',
	templateUrl: './new-message.component.html',
	styleUrls: ['./new-message.component.scss'],
})
export class NewMessageComponent implements OnInit, AfterViewChecked {
	form: FormGroup;
	loading: boolean;
	noUserError = false;
	emptyResults: boolean;
	users: Set<any> = new Set([]);
	@Output() newMessageSend: EventEmitter<Number> = new EventEmitter<Number>();
  @Input() is_chat_notification:boolean;
  @Input() isPopup: boolean;
	inputEl: HTMLInputElement;

	constructor(
		private cdRef: ChangeDetectorRef,
		private fb: FormBuilder,
		private storageService: LocalStorageService,
		private firestoreService: FirestoreService,
		private http: ApiService
	) {}
	
	ngOnInit(): void {
		this.form = this.fb.group({
			message: ['', [Validators.required]],
		});
		setTimeout(() => {
			this.inputEl = document.getElementsByClassName('with-button input-full-width')[0] as  HTMLInputElement;
			this.inputEl.disabled = true;
		});
	}

	
	ngAfterViewChecked() {
		this.cdRef.detectChanges();
	  }

	async submit({ message }: { files: File[]; message: string }): Promise<void> {
		if (!message.trim()) {
			return;
		}
		if (this.users.size === 0) {
			this.noUserError = true;
		//	this.noUserrecods=true;
			setTimeout(() => {
				this.noUserError = false;
			}, 2000);
			return;
		}
		this.noUserError = false;
		const userIds = Array.from(this.users).map<string>((item) => item.id.toString());
		const nonDuplicateIds = [...new Set(userIds)].filter((userId) => userId !== this.storageService.userId);
		this.close(null);
		// alert(message)
		await this.firestoreService.addChatGroups(nonDuplicateIds, message,this.is_chat_notification );
		const id = nonDuplicateIds && nonDuplicateIds.length === 1 ? parseInt(nonDuplicateIds[0]) : null
		this.newMessageSend.emit(id);
	}

	onUserSelected(users: Set<any>): void {
		if (users) {
			this.emptyResults=false;
			const filterUsers = [];
			Array.from(users).forEach((user) => {
				if (!filterUsers.some((item) => item.id === user.id)) {
					filterUsers.push(user);
				}
			});
			this.users = new Set(filterUsers);
			if (this.users?.size === 0) {
				setTimeout(() => {
					this.inputEl.disabled = true
				});
			} else {
				setTimeout(() => {
					this.inputEl.disabled = false
				});
			}

		} else {
			
			setTimeout(() => {
				this.inputEl.disabled = true
			});
		}
	}

	close(openNext): void {
		// this.ref.close(openNext);
	}
	noRecordFound(event){
		//console.log(event,"event");
		this.emptyResults=event;
	}
}
