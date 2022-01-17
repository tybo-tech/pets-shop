
export interface DictionaryModel {
    Key: string;
    Value: string;
    Label: string;
    InputType: string;
}


export const initNavTheme: DictionaryModel[] = [
    { Key: 'background', Value: '#303133', Label: 'Background', InputType: 'color' },
    { Key: 'color', Value: '#E1BA66', Label: 'Text Colour', InputType: 'color' },
    { Key: 'border-color', Value: '#ffffff', Label: 'Border Colour', InputType: 'color' },
];


export const allStyles: DictionaryModel[] = [
    { Key: 'background', Value: '#303133', Label: 'Background', InputType: 'color' },
    { Key: 'color', Value: '#E1BA66', Label: 'Text Colour', InputType: 'color' },
    { Key: 'padding', Value: '#ffffff', Label: 'Border Colour', InputType: 'text' },
    { Key: 'margin', Value: '#ffffff', Label: 'Border Colour', InputType: 'text' },
    { Key: 'display', Value: '#ffffff', Label: 'Border Colour', InputType: 'text' },
    { Key: 'position', Value: '#ffffff', Label: 'Border Colour', InputType: 'text' },
    { Key: 'left', Value: '#ffffff', Label: 'Border Colour', InputType: 'number' },
    { Key: 'width', Value: '#ffffff', Label: 'Border Colour', InputType: 'text' },
    { Key: 'height', Value: '#ffffff', Label: 'Border Colour', InputType: 'text' },
];