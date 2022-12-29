import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-calculator-volume',
    templateUrl: './calculator-volume.component.html',
    styleUrls: ['./calculator-volume.component.scss']
})
export class CalculatorVolumeComponent implements OnInit {
    mass = null;
    massUnit = 1;
    
    formulaWeight = null;
    
    con = null;
    conUnit = 1;
    
    requiredVol: any;
    requiredVolUnit: any;
    
    
    conUnitList: any;
    massUnitList: any;
    
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
        this.massUnitList = [
            {value: 1, name: 'gram'},
            {value: 10 ** -3, name: 'milligram'},
            {value: 10 ** -6, name: 'microgram'},
        ];
    }
    
    calcResult(): void {
        const inputMass = this.mass * this.massUnit;
        const inputCon = this.con * this.conUnit;

        this.calcImpossible = inputMass === 0 || inputCon === 0 || this.formulaWeight === 0;
        
        this.requiredVol = inputMass / (this.formulaWeight * inputCon);
        
        if (this.requiredVol <= 10 ** -4) {
            this.requiredVol = this.requiredVol * 10 ** 6;
            this.requiredVolUnit = 'microliters';
        } else if (this.requiredVol <= 10 ** -1) {
            this.requiredVol = this.requiredVol * 10 ** 3;
            this.requiredVolUnit = 'milliliters';
        } else {
            this.requiredVolUnit = 'liters';
        }
        
        this.requiredVol = Number(this.requiredVol).toFixed(4);
    }
}
