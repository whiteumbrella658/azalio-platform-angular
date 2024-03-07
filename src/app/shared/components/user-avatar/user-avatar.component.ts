
/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

 import { Component, HostBinding, Input, OnInit } from '@angular/core';
 import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
 
 import { convertToBoolProperty, NbBooleanInput } from './helpers';
 @Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
 })

 export class UserAvatarComponent implements OnInit {
 
   imageBackgroundStyle: SafeStyle;
 @Input() outsideRadiusStart:boolean;
 @Input() outsideRadiusEnd:boolean;
 @Input() task:boolean;
 @Input() showBadge: boolean;
   /**
    * Specifies a name to be shown on the right of a user picture
    * @type string
    */
   @Input() name: string = 'Anonymous';
 
   /**
    * Specifies a title to be shown under the **name**
    * @type string
    */
   @Input() title: string;
 
   /**
    * Absolute path to a user picture or base64 image.
    * User name initials will be shown if no picture specified (JD for John Doe).
    * @type string
    */
   @Input()
   set picture(value: string) {
     this.imageBackgroundStyle = value ? this.domSanitizer.bypassSecurityTrustStyle(`url(${value})`) : null;
   }
 
   /**
    * Color of the area shown when no picture specified
    * @type string
    */
   @Input() color: string;
   @Input() initialColor: string;
   @Input() customText: string;
   @Input() scheduledHours: string;
 
   /**
    * Whether to show a user name or not
    */
   @Input()
   get showName(): boolean {
     return this._showName;
   }
   set showName(val: boolean) {
     this._showName = convertToBoolProperty(val);
   }
   private _showName: boolean = true;
   static ngAcceptInputType_showName: NbBooleanInput;
 
   /**
    * Whether to show a user title or not
    * @type boolean
    */
   @Input()
   get showTitle(): boolean {
     return this._showTitle;
   }
   set showTitle(val: boolean) {
     this._showTitle = convertToBoolProperty(val);
   }
   private _showTitle: boolean = true;
   static ngAcceptInputType_showTitle: NbBooleanInput;
 
   /**
    * Whether to show a user initials (if no picture specified) or not
    * @type boolean
    */
   @Input()
   get showInitials(): boolean {
     return this._showInitials;
   }
   set showInitials(val: boolean) {
     this._showInitials = convertToBoolProperty(val);
   }
   private _showInitials: boolean = true;
   static ngAcceptInputType_showInitials: NbBooleanInput;
 
   /**
    * Whether to show only a picture or also show the name and title
    * @type boolean
    */
   @Input()
   get onlyPicture(): boolean {
     return !this.showName && !this.showTitle;
   }
   set onlyPicture(val: boolean) {
     this.showName = this.showTitle = !convertToBoolProperty(val);
   }
   static ngAcceptInputType_onlyPicture: NbBooleanInput;


   constructor(private domSanitizer: DomSanitizer) {}
 
   ngOnInit(){
   }
   getInitials(): string {
     if (this.name) {
       const names = this.name.split(' ');
 
       return names.map(n => n.charAt(0)).splice(0, 2).join('').toUpperCase();
     }
 
     return '';
   }
 }
