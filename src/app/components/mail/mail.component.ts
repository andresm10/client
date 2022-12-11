import { Component } from '@angular/core';
import {MailService} from '../../services/mail.service'
import {Mail} from './../../interfaces/Mails'
import {EmailResponse} from './../../interfaces/EmailResponse'
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
    provider: ''
  };
  constructor(private readonly mailService: MailService){}

  sendEmail(){
    console.log('provider',this.mail.provider);
    
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

  async sendWithMailgun(){
    console.log('Angular request data',this.mail);
    this.mail.body=this.htmlContent
    await this.mailService.sendWithMailgun(this.mail).subscribe(
      res=>{
        console.log("Angular response mailgun",res)
        Swal.fire('Mailgun Cli', res.message, 'success');
      },
      err=>{
        console.log("Angular response error mailgun",err)
        Swal.fire('Mailgun Cli', `${err.message}<br /> <span class="font-weight-bold">Trying send with AWS SES.</span>`, 'error');
        setTimeout(()=>{
          this.sendWithAwsSes();
        },2000)
      }
    )
  }

 async sendWithAwsSes(){
    console.log('Angular request data',this.mail);
    this.mail.body=this.htmlContent
    await this.mailService.sendWithAwsSes(this.mail).subscribe(
      res=>{
        console.log("Angular response AWS SES",res)
        Swal.fire('AWS SES', res.message, 'success');
      },
      err=>{
        console.log("Angular response error AWS SES",err)
        Swal.fire('AWS SES', `${err.message} <br /> <span class="font-weight-bold">Trying send with Mailgun.</span>`, 'error');
        
        setTimeout(()=>{
          this.sendWithMailgun();
        },3000)
      }
    )
 }
}
