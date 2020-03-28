import { Injectable, Output, EventEmitter } from '@angular/core';
import { Symptoms } from '../interfaces/symptoms';
import { PoorPrognosticFactor } from '../interfaces/poor-prognostic-factor';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  resultat: any;
  message: any;
  possibleResults: {}[];

  @Output() langChangedEvent = new EventEmitter<string>();

  constructor(public translateService: TranslateService) {

    this.message = {
      ar: 'خليك فدارك حتى تحيد الاعراض، عبر درجة الحراة 2 مرات فالنهار. ومتنساوش النظافة و غسل إيديك بزاف ديال المرات فالنهار.',
      fr: 'Restez chez vous au maximum en attendant que les symptômes disparaissent. Prenez votre température deux fois par jour. Rappel des mesures d’hygiène.'
    };

    this.possibleResults = [
      {
        ar: 'خصك تعيط ل 141',
        fr: 'Appelez le 141'
      },
      {
        ar: 'تنوصيوك باش تبقى فدارك و تتصل بطبيبك إذا بانت شي أعراض أخرى . وتقد فاي وقت تعاود الإختبار باش طمن على راسك',
        fr: 'Nous vous conseillons de rester à votre domicile et de contacter votre médecin en cas d’apparition de nouveaux symptômes. Vous pourrez aussi utiliser à nouveau l’application pour réévaluer vos symptômes'
      },
      {
        ar: 'تقد تشاور مع طبيب فالتيليفون او يزورك طبيب فالدار' +
          '\nإذا كان عندك صعوبة فالتنفس او مقديتيش تاكل مزيان او تشرب لكثر من 24 ساعة ضروري اتصل ب 141',
        fr: 'Vous pouvez faire une téléconsultation ou médecin généraliste ou visite à domicile.'
          + '\nAppelez le 141 si une gêne respiratoire ou des difficultés importantes pour s’alimenter ou boire pendant plus de 24h apparaissent.'
      },
      {
        ar: 'مافيكش فيروس كورونا على الأرجح، ولكن إلى شكيتي ممكن تتصل بطبيب ديالك',
        fr: 'Votre situation ne relève probablement pas du Covid-19. Consultez votre médecin au moindre doute.'
      },
      {
        ar: 'مافيكش فيروس كورونا على الأرجح؛ تنصحوك تشاور مع طبيب. وإلى شكيتي اتصل ب 141',
        fr: 'Votre situation ne relève probablement pas du Covid-19. Un avis médical est recommandé. Au moindre doute, appelez le 141'
      },
      {
        ar: 'مافيكش فيروس كورونا على الأرجح، إذا عندك شك اتصل بالطبيب ديالك. تقد تعاود الإختبار لكانوا عندك اعراض اخرى. لبغيتي تعرف اكثر على الڤيروس ممكن تشوف صفحة النصائح',
        fr: 'Votre situation ne relève probablement pas du Covid-19. N’hésitez pas à contacter votre médecin en cas de doute. Vous pouvez refaire le test en cas de nouveau symptôme pour réévaluer la situation. Pour toute information concernant le Covid-19, consulter la page Conseils'
      }
    ];
  }

  calculateMinorSeverityFactor(symptoms: Symptoms) {
    let factor = 0;
    if (symptoms.feverDeg >= 39) { factor++; }
    if (symptoms.tiredness) { factor++; }
    if (symptoms.discomfort) { factor++; }
    return factor;
  }

  calculateMajorSeverityFactor(symptoms: Symptoms) {
    let factor = 0;
    if (symptoms.dyspnea) { factor++; }
    if (symptoms.anorexia) { factor++; }
    if (symptoms.feverDeg <= 35.4) { factor++; }
    return factor;
  }

  calculatePoorPrognosticFactor(ppf: PoorPrognosticFactor) {
    if (ppf.age >= 70 || ppf.imc >= 30 || ppf.pregnancy || ppf.breathingIllness || ppf.cancer || ppf.chronicLiverDisease
      || ppf.chronicRenalFailure || ppf.diabetes || ppf.heartDisease || ppf.immuneSystemDisease || ppf.immunosuppressiveTherapy) {
      return true;
    } else {
      return false;
    }
  }

  getResult(symptoms: Symptoms, ppf: PoorPrognosticFactor) {
    const fact_gravite_min = this.calculateMinorSeverityFactor(symptoms);
    const fact_gravite_maj = this.calculateMajorSeverityFactor(symptoms);
    const fact_pronostique = this.calculatePoorPrognosticFactor(ppf);


    if (symptoms.fever || (symptoms.cough && symptoms.soreThroat) || (symptoms.cough && symptoms.muscularPain) || (symptoms.fever && symptoms.diarrhea)) {
      if (fact_gravite_maj > 0) {
        this.resultat = this.possibleResults[0];
      } else if (!fact_pronostique) {
        if (ppf.age < 50 && fact_gravite_min === 0) {
          this.resultat = this.possibleResults[1];
        }
        if (((ppf.age > 50 && ppf.age < 70) && fact_gravite_min === 0) || fact_gravite_min > 0) {
          this.resultat = this.possibleResults[2];
        }
      } else {
        if (fact_gravite_min <= 1) {
          this.resultat = this.possibleResults[2];
        } else {
          this.resultat = this.possibleResults[0];
        }
      }
    } else if (symptoms.fever && symptoms.cough) {
      if (fact_gravite_maj > 0) {
        this.resultat = this.possibleResults[0];
      } else if (!fact_pronostique) {
        this.resultat = this.possibleResults[2];
      } else {
        if (fact_gravite_min <= 1) {
          this.resultat = this.possibleResults[2];
        } else {
          this.resultat = this.possibleResults[0];
        }
      }
    } else if (symptoms.fever || symptoms.cough || symptoms.soreThroat || symptoms.muscularPain) {
      if (fact_gravite_maj === 0 && fact_gravite_min === 0) {
        this.resultat = this.possibleResults[3];
      } else if (fact_gravite_min > 0 || fact_gravite_maj > 0 || fact_pronostique) {
        this.resultat = this.possibleResults[4];
      }
    } else {
      this.resultat = this.possibleResults[5];
    }
  }

  langChanged(msg: string) {
    this.langChangedEvent.emit(msg);
  }

}
