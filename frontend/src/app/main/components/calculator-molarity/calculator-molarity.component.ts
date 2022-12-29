import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-calculator-molarity',
    templateUrl: './calculator-molarity.component.html',
    styleUrls: ['./calculator-molarity.component.scss']
})
export class CalculatorMolarityComponent implements OnInit {
    
    mass = null;
    massUnit = 1;
    
    formulaWeight = null;
    
    vol = null;
    volUnit = 1;
    
    con: any;
    conUnit: any;
    
    massUnitList: any;
    volUnitList: any;
    
    calcImpossible = false;
    
    
    constructor() {
    }
    
    ngOnInit(): void {
        this.initialize();
        this.calcResult();
    }
    
    initialize(): void {
        this.massUnitList = [
            {value: 1, name: 'gram'},
            {value: 10 ** -3, name: 'milligram'},
            {value: 10 ** -6, name: 'microgram'},
        ];
        this.volUnitList = [
            {value: 1, name: 'liter'},
            {value: 10 ** -3, name: 'milliliter'},
            {value: 10 ** -6, name: 'microliter'},
        ];
    }
    
    calcResult(): void {
        const inputMass = this.mass * this.massUnit;
        const inputVol = this.vol * this.volUnit;
        
        this.calcImpossible = inputMass === 0 || inputVol === 0 || this.formulaWeight === 0;
        this.con = inputMass / (inputVol * this.formulaWeight);
        
        if (this.con <= 10 ** -4) {
            this.con = this.con * 10 ** 6;
            this.conUnit = 'micromolar';
        } else if (this.con <= 10 ** -1) {
            this.con = this.con * 10 ** 3;
            this.conUnit = 'millimolar';
        } else {
            this.conUnit = 'molar';
        }
        
        this.con = Number(this.con).toFixed(4);
    }
}

