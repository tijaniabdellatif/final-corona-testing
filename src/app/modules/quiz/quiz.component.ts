import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { TestService } from 'src/app/shared/services/test.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  @ViewChild('nextButton') btn;

  resultat: any;
  message: string;

  constructor(private service: TestService, private router: Router) { }

  ngOnInit(): void {
    this.service.langChangedEvent.subscribe((data: string) => {
      if (this.resultat == null) {
        console.log('null');
      } else {
        if (data === 'ar') {
          this.resultat = this.service.resultat.ar;
          this.message = this.service.message.ar;
        } else {
          this.resultat = this.service.resultat.fr;
          this.message = this.service.message.fr;
        }
      }
    });
  }

  switchDirection() {
    if (localStorage.getItem('lang') === 'ar') {
      return 'rtl';
    } else if (localStorage.getItem('lang') === 'fr') {
      return 'ltr';
    }
  }

  switchDirectionReverse() {
    if (localStorage.getItem('lang') === 'ar') {
      return 'ltr';
    } else if (localStorage.getItem('lang') === 'fr') {
      return 'rtl';
    }
  }

  alignText() {
    if (localStorage.getItem('lang') === 'ar') {
      return 'text-align-right';
    } else if (localStorage.getItem('lang') === 'fr') {
      return 'text-align-left';
    }
  }

  goNext(stepper: MatStepper) {
    stepper.next();
  }

  nextClicked() {
    if (localStorage.getItem('lang') === 'ar') {
      this.resultat = this.service.resultat.ar;
      this.message = this.service.message.ar;
    } else if (localStorage.getItem('lang') === 'fr') {
      this.resultat = this.service.resultat.fr;
      this.message = this.service.message.fr;
    }
    this.btn.nativeElement.click();
  }

  restart() {
    location.reload(true);
  }

  checkResult() {
    console.log('check check');
    if (this.resultat === 'خصك تعيط ل 141') {
      return true;
    } else {
      return false;
    }
  }

  realTimeResult() {
    return this.resultat;
  }

}
