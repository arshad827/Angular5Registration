import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BtAuthService } from '../../bt-auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { User } from '../../model/users';

@Component({
  selector: 'app-bt-register',
  templateUrl: './bt-register.component.html',
  styleUrls: ['./bt-register.component.css']
})
export class BtRegisterComponent implements OnInit {
  btPinSuggestion;
  useBTPinSuggestion;
  btPinCheckUnCheck = 'cancel';
  btnDisable: boolean;
  btnDisableForm3 = true;
  btnDisableForm4 = true;
  haveObjective: boolean;
  userObjArr = [];
  designations;
  autobaseCity;
  minDate = new Date(1980, 12, 31);
  maxDate = new Date(1999, 12, 31);
  getDOB: Date;
  gender = 'Male';
  skillsWithIndustry;
  industryList;
  defaultskillsWithIndustry;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  forthFormGroup: FormGroup;
  filteredOptions: Observable<string[]>;
  temp;
  designationsArr = [];
  userSkillsArr = [];
  clear;
  getAllObjevtives;
  firstHalf = [];
  secondHalf = [];
  selectedIndustry: string;
  skillBySelectedIndustry;
  selectedCheckBox;
  Btpin_class = false;
  color = 'color_red';
  constructor(private btAuthService: BtAuthService) { }

  ngOnInit() {
    // Get Objetives
    this.btAuthService.getObjective().subscribe(
      (objectives) => {
        this.getAllObjevtives = objectives;
        const countObjectives = objectives.length;
        const halfCount = Math.ceil(objectives.length / 2);
        for (let i = 0; i < countObjectives; i++) {
          if (i < halfCount) {
            this.firstHalf.push(objectives[i]);
          } else {
            this.secondHalf.push(objectives[i]);
          }
        }
      }
    );

    // get the designations
    if (sessionStorage.getItem('designations')) {
      this.designations = JSON.parse(sessionStorage.getItem('designations'));
    } else {
      this.btAuthService.getDesignations()
        .subscribe(
        (designations) => {
          this.designations = designations.designations;
          sessionStorage.setItem('designations', JSON.stringify(designations.designations));
        },
        (error) => {
          console.log(error);
        }
        );
    }

    // get the basecity
    // getBaseCityDetails
    if (sessionStorage.getItem('city')) {
      this.autobaseCity = JSON.parse(sessionStorage.getItem('city'));
    } else {
      this.btAuthService.getBaseCityDetails()
        .subscribe(
        (data) => {
          this.autobaseCity = data;
          sessionStorage.setItem('city', JSON.stringify(this.autobaseCity));
        },
        (error) => {
          console.log(error);
        }
        );
    }

    /**
     * First Form
     */
    this.firstFormGroup = new FormGroup({
      blueTiePin: new FormControl('', Validators.required, this.checkIfBTPinExist.bind(this))
    });

    let parsedData;
    if (sessionStorage.getItem('userData')) {
      parsedData = JSON.parse(sessionStorage.getItem('userData'));
    } else {
      parsedData = {
        'firstName': '',
        'lastName': ''
      };
    }
    /**
     * Second Form
     */
    this.secondFormGroup = new FormGroup({
      userFirstName: new FormControl(parsedData.firstName, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]),
      userLastName: new FormControl(parsedData.lastName, [Validators.pattern('[a-zA-Z ]*$')]),
      userDOB: new FormControl('', [Validators.required]),
      userGender: new FormControl('Male'),
      userDesignation: new FormControl('', [Validators.required]),
      userCompany: new FormControl('', [Validators.required]),
      basecity: new FormControl('', [Validators.required])
    });
    // Filter
    this.secondFormGroup.controls.userDesignation.valueChanges
      .subscribe(
      (val) => {
        this.filterdesginations(val);
      }
      );
    this.secondFormGroup.controls.basecity.valueChanges
      .subscribe(
      (val) => {
        this.filterBasecity(val);
      }
      );


    /**
    * Third Form
    */
    this.thirdFormGroup = new FormGroup({
      userObjectives: new FormControl('', Validators.required, this.validateform3.bind(this))
    });

    /**
    * Fourth Form
    */
    this.forthFormGroup = new FormGroup({
      userSkills: new FormControl(''),
      userIndustry: new FormControl(''),
      skillBySelectedIndustry: new FormControl('')
    });

    if (sessionStorage.getItem('SkillSet')) {
      this.skillsWithIndustry = JSON.parse(sessionStorage.getItem('SkillSet'));
    } else {
      this.btAuthService.getSkillSets()
        .subscribe(
        (skills: any) => {
          this.skillsWithIndustry = skills.industryList.skill;
        },
        (error) => {
          console.log('error', error);
        }
        );
    }
    this.forthFormGroup.controls.userSkills.valueChanges
      .subscribe(
      (val) => {
        this.filterskills(val);
      }
      );

    this.forthFormGroup.controls.userIndustry.valueChanges
      .subscribe(
      () => {
        this.getselectedIndustry();
      }
      );

    if (sessionStorage.getItem('industryList')) {
      this.industryList = JSON.parse(sessionStorage.getItem('industryList'));
    } else {
      this.btAuthService.getIndustryList()
        .subscribe(
        (skills: any) => {
          this.industryList = skills;
        },
        (error) => {
          console.log('error', error);
        }
        );
    }
  }
  /**sessionStorage.getItem('userData')
   * Check If BlueTie Pin Exist or not
   */

  checkIfBTPinExist(control: FormControl): Promise<any> | Observable<any> {
    this.btnDisable = true;
    const promise = new Promise<any>((resolve, reject) => {
      this.btAuthService.checkIfBTPinExist(control.value).subscribe(
        (data) => {
          if (data.STATUS === 1001) {
            this.btnDisable = false;
            this.btPinCheckUnCheck = 'check_circle';
            this.color = 'color_green';
            resolve(true);
          } else {
            this.btPinSuggestion = data.RESULT;
            this.btPinCheckUnCheck = 'cancel';
            this.color = 'color_red';
            resolve(data.RESULT);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    });
    return promise;
  }

  /**
   *
   *  Use Suggested BTPIN
   */
  useSuggestionBTPIN(bTPIN) {
    this.useBTPinSuggestion = bTPIN;
  }

  /**
   * Store the BTPIN
   */
  storeBtPin(data) {
    this.btAuthService.createNewBtPin(data).subscribe(
      (response) => {
      }
    );
  }
  validateform3(control: FormControl) {
    if (this.userObjArr.length > 0) {
      const promise = new Promise<any>((resolve, reject) => {
        this.btnDisableForm3 = false;
        resolve();
      });
      return promise;
    } else {
      const promise = new Promise<any>((resolve, reject) => {
        this.btnDisableForm3 = true;
        resolve();
      });
      return promise;
    }
  }

  /**
   * Autocomplete Filter for designations
   */
  filterdesginations(val) {
    this.designations = JSON.parse(sessionStorage.getItem('designations'));
    this.designations = this.designations.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
    return this.designations;
  }

  /**
   * Autocomplete Filter for BaseCity
   */
  filterBasecity(val) {
    this.autobaseCity = JSON.parse(sessionStorage.getItem('city'));
    this.autobaseCity = this.autobaseCity.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
    return this.autobaseCity;
  }

  /**
   * Fliter the Skills With Industry
   */
  filterskills(val) {
    this.defaultskillsWithIndustry = JSON.parse(sessionStorage.getItem('SkillSet'));
    if (val) {
      for (const industrys of this.defaultskillsWithIndustry) {
        industrys.skill = industrys.skill.filter(skillsArray =>
          skillsArray.toLowerCase().indexOf(val.toLowerCase()) === 0);
      }
      this.defaultskillsWithIndustry = this.defaultskillsWithIndustry.filter(nestedArray => nestedArray.skill.length !== 0);
    }
    return this.skillsWithIndustry = this.defaultskillsWithIndustry;
  }
  /**
   * Filter the Industry
   * (Not Being used)
   */
  filterIndustry(val) {
    this.industryList = JSON.parse(sessionStorage.getItem('industryList'));
    if (val) {
      this.industryList = this.industryList.filter(option =>
        option.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }
    return this.industryList = this.industryList;
  }
  /**
   * Set the Gender
   */
  getGender(val) {
    this.gender = val;
  }

  saveUserDeatails(data) {
    const year = data.userDOB.getFullYear();
    const month = data.userDOB.getMonth() + 1;
    const day = data.userDOB.getDate();
    const hours = data.userDOB.getHours();
    const minutes = data.userDOB.getMinutes();
    const seconds = data.userDOB.getSeconds();
    const myEpoch = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    data.userDOB = myEpoch;
    this.btAuthService.saveUserDetails(data).subscribe(
      (response) => {
      }
    );
  }

  storeObjectives(value) {
    if (this.userObjArr.indexOf(value) === -1) {
      this.userObjArr.push(value);
    } else {
      const index = this.userObjArr.indexOf(value);
      this.userObjArr.splice(index, 1);
    }
  }
  saveUserObjectives() {
    const explore = sessionStorage.getItem('explore');
    if (this.userObjArr.indexOf(explore) === -1) {
      this.userObjArr.push(explore);
    }
    const data = this.userObjArr;
    this.btAuthService.saveObjective(data).subscribe(
      (response) => {
      }
    );
  }
  saveUserSkills() {
    let data;
    if (this.userSkillsArr.length > 0) {
      data = this.userSkillsArr;
    } else if (this.designationsArr.length > 0) {
      data = this.designationsArr;
    }
    this.btAuthService.saveSkills(data).subscribe(
      (response) => {
      }
    );
  }
  validateskillsArr() {
    if (this.userSkillsArr.length > 0) {
      const promise = new Promise<any>((resolve, reject) => {
        this.btnDisableForm4 = false;
        resolve();
      });
      return promise;
    } else {
      const promise = new Promise<any>((resolve, reject) => {
        this.btnDisableForm4 = true;
        resolve();
      });
      return promise;
    }
  }
  validateIndustryArr() {
    if (this.designationsArr.length > 0) {
      const promise = new Promise<any>((resolve, reject) => {
        this.btnDisableForm4 = false;
        resolve();
      });
      return promise;
    } else {
      const promise = new Promise<any>((resolve, reject) => {
        this.btnDisableForm4 = true;
        resolve();
      });
      return promise;
    }
  }

  removerSkillsChip(value) {
    if (this.userSkillsArr.length > 0) {
      const index = this.userSkillsArr.indexOf(value);
      this.userSkillsArr.splice(index, 1);

      console.log(value);

      // tslint:disable-next-line:max-line-length
      const selectedIndex = this.forthFormGroup.controls.skillBySelectedIndustry.value.indexOf(value);
      console.log(selectedIndex);
      if (selectedIndex > -1) {
        console.log(this.forthFormGroup.controls.skillBySelectedIndustry.value.slice());
        const newSelectedValue = this.forthFormGroup.controls.skillBySelectedIndustry.value.slice();
        const gettheSelectedValueType = typeof newSelectedValue;
        if (gettheSelectedValueType !== 'string') {
          newSelectedValue.splice(selectedIndex, 1);
        }
        this.forthFormGroup.controls.skillBySelectedIndustry.setValue(newSelectedValue);
      }


      this.selectedCheckBox = this.userSkillsArr;
      if (this.userSkillsArr.length === 0) {
        this.btnDisableForm4 = true;
      }

    }

  }
  removerSkillsByIndustryChip(value) {
    if (this.userSkillsArr.length > 0) {
      const index = this.userSkillsArr.indexOf(value);
      this.userSkillsArr.splice(index, 1);
      const selectedIndex = this.forthFormGroup.controls.skillBySelectedIndustry.value.indexOf(value);
      if (selectedIndex > -1) {
        console.log(this.forthFormGroup.controls.skillBySelectedIndustry.value.slice());
        const newSelectedValue = this.forthFormGroup.controls.skillBySelectedIndustry.value.slice();
        console.log(typeof newSelectedValue);
        newSelectedValue.splice(selectedIndex, 1);
        this.forthFormGroup.controls.skillBySelectedIndustry.setValue(newSelectedValue);
      }

      // To Check array is empty and disable the button
      if (this.userSkillsArr.length === 0) {
        this.btnDisableForm4 = true;
      }

    }
  }

  addSkillWithOutIndustry(skill) {
    if (this.userSkillsArr.indexOf(skill) === -1) {
      this.userSkillsArr.push(skill);
    }
    if (this.userSkillsArr.length === 5) {
      this.btnDisableForm4 = false;
    } else {
      this.btnDisableForm4 = true;
    }
    this.selectedIndustry = null;
    this.clear = null;
  }
  addSkillByIndustry(skill) {
    if (this.userSkillsArr.indexOf(skill) === -1) {
      this.userSkillsArr.push(skill);
    }
    if (this.userSkillsArr.length === 5) {
      this.btnDisableForm4 = false;
    } else {
      this.btnDisableForm4 = true;
    }
    this.selectedCheckBox = this.userSkillsArr;
  }

  /**
   * Call the Skill By Industry name
   */
  getselectedIndustry() {
    const type = typeof this.selectedIndustry;
    if (type !== 'undefined' && this.selectedIndustry !== null) {
      this.btAuthService.skillByIndustryName(this.selectedIndustry)
        .subscribe(
        (skills) => {
          if (skills.skillsByIndustry.length > 0) {
            this.skillBySelectedIndustry = skills.skillsByIndustry;
          }
        }
        );
    }
  }


  /**
   * Disable Option if skill is added in array
   */
  isAddedInArr(value) {
    if (this.userSkillsArr.indexOf(value) !== -1) {
      return true;
    } else {
      return false;
    }

  }

  bTpindescription() {
    this.Btpin_class = true;
  }
  bTsimplifyingclose() {
    this.Btpin_class = false;

  }
}
