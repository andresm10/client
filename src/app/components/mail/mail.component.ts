import { Component } from '@angular/core';
import {MailService} from '../../services/mail.service'
import {Mail} from './../../interfaces/Mails'
import {AngularEditorConfig} from '@kolkov/angular-editor'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css']
})
export class MailComponent {

  htmlContent=''
  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '200px',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: []
};


  mail:Mail = {
    body: '',
    subject:'',
    to: '',
    from:'',
    provider: 'aws-ses'
  };
  constructor(private readonly mailService: MailService){}

  sendEmail(){
    switch(this.mail.provider){
      case 'aws-ses':
        this.sendWithAwsSes();
        break;
      case 'mailgun':
        this.sendWithMailgun();
        break;
      default:
          this.sendWithAwsSes();
          break;
    }
  }

  isValid():boolean{
    
    return (this.mail.to.trim()=="" || this.mail.subject.trim()=="")?false:true;
  }

  isValidEmail():boolean{
    const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return (!this.mail.to.match(regexEmail))?false:true;
  }

  async sendWithMailgun(){
    this.mail.body=this.htmlContent
    if(!this.isValid()){
      Swal.fire("Bad request", "Please enter the required data", "error")
      return;
    }

    if(!this.isValidEmail()){
      Swal.fire("Bad request", "Invalid email", "error")
      return;
    }
    await this.mailService.sendWithMailgun(this.mail).subscribe(
      res=>{
        Swal.fire('Mailgun Cli', res.message, 'success');
      },
      err=>{
        Swal.fire({
          title: 'Mailgun Cli',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Yes',
          denyButtonText: `Not`,
          html: `${err.message}<br /> <span class="font-weight-bold">Do you want a send with AWS SES?.</span>`
        }).then((result) => {
          if (result.isConfirmed) {
            this.sendWithAwsSes();
          }
        })

      }
    )
  }

 async sendWithAwsSes(){
    if(!this.isValid()){
      Swal.fire("Bad request", "Please enter the required data", "error")
      return;
    }

    if(!this.isValidEmail()){
      Swal.fire("Bad request", "Invalid email", "error")
      return;
    }

    this.mail.body=this.htmlContent
    await this.mailService.sendWithAwsSes(this.mail).subscribe(
      res=>{
        Swal.fire('AWS SES', res.message, 'success');
      },
      err=>{
        Swal.fire({
          title: 'AWS SES',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Yes',
          denyButtonText: `Not`,
          html: `${err.message} <br /> <span class="font-weight-bold">Do you want a send with Mailgun?.</span>`
        }).then((result) => {
          if (result.isConfirmed) {
            this.sendWithMailgun();
          }
        })
      }
    )
 }
}
