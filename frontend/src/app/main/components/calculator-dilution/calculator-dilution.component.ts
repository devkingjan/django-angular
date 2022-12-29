import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-calculator-dilution',
    templateUrl: './calculator-dilution.component.html',
    styleUrls: ['./calculator-dilution.component.scss']
})
export class CalculatorDilutionComponent implements OnInit {
    stockCon = null;
    stockConUnit = 1;
    
    desiredCon = null;
    desiredConUnit = 1;
    
    desiredVol = null;
    desiredVolUnit = 1;
    
    requiredVol: any;
    requiredVolUnit = '';
    
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
        // Define Standard Formula Inputs
        const m1 = this.stockCon * this.stockConUnit;
        const m2 = this.desiredCon * this.desiredConUnit;
        const v2 = this.desiredVol * this.desiredVolUnit;
        
        // Detect if calculation is impossible, otherwise calculate
        
        this.calcImpossible = m1 < m2;
        if (m1 === 0 || m2 === 0 || v2 === 0) {
            this.calcImpossible = true;
        }
        
        if (this.calcImpossible) {
            return;
        }
        
        this.requiredVol = m2 * v2 / m1;
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
