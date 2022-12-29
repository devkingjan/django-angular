import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-calculator-mass',
    templateUrl: './calculator-mass.component.html',
    styleUrls: ['./calculator-mass.component.scss']
})
export class CalculatorMassComponent implements OnInit {
    con = null;
    conUnit = 1;
    
    formulaWeight = null;
    
    desiredVol = null;
    desiredVolUnit = 1;
    
    mass: any;
    massUnit: any;
    
    conUnitList: any;
    volUnitList: any;
    
    calcImpossible = false;
    
    constructor() {
    }
    
    ngOnInit(): void {
        this.initialize();
        this.calcResult();
    }
    
    initialize(): void {
        this.conUnitList = [
            {value: 1, name: 'molar'},
            {value: 10 ** -3, name: 'millimolar'},
            {value: 10 ** -6, name: 'micromolar'},
            {value: 10 ** -9, name: 'nanomolar'},
            {value: 10 ** -12, name: 'picomolar'},
            {value: 10 ** -15, name: 'femtomolar'},
        ];
        this.volUnitList = [
            {value: 1, name: 'liter'},
            {value: 10 ** -3, name: 'milliliter'},
            {value: 10 ** -6, name: 'microliter'},
        ];
    }
    
    calcResult(): void {
        const inputCon = this.con * this.conUnit;
        const inputVol = this.desiredVol * this.desiredVolUnit;
        
        this.calcImpossible = inputCon === 0 || inputVol === 0 || this.formulaWeight === 0;
        
        this.mass = inputCon * inputVol * this.formulaWeight;
        
        if (this.mass <= 10 ** -4) {
            this.mass = this.mass * 10 ** 6;
            this.massUnit = 'micrograms';
        } else if (this.mass <= 10 ** -1) {
            this.mass = this.mass * 10 ** 3;
            this.massUnit = 'milligrams';
        } else {
            this.massUnit = 'grams';
        }
        
        this.mass = Number(this.mass).toFixed(4);
    }
    
}
