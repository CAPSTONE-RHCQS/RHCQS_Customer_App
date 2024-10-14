interface FontFamily {
    montserat_bold: string;
    montserat_light: string;
    montserat_medium: string;
    montserat_regular: string;
    montserat_semibold: string;
  }
  
  export const FONTFAMILY: FontFamily = {
    montserat_bold: 'Montserrat-Bold',
    montserat_light: 'Montserrat-Light',
    montserat_medium: 'Montserrat-Medium',
    montserat_regular: 'Montserrat-Regular',
    montserat_semibold: 'Montserrat-SemiBold',
  };

  interface Colors {
    primary: string;
    secondary: string;
    tertiary: string;
    background: string;
    text: string;
    loadingOverlay: string;
    activityIndicator: string;
  }
  
  export const COLORS: Colors = {
    primary: '#53A6A8',
    secondary: '#3C9597',
    tertiary: '#1F7F81',
    background: '#FFFFFF',
    text: '#000000',
    loadingOverlay: 'rgba(255, 255, 255, 0.5)',
    activityIndicator: '#0000ff',
  };
  
  interface Gradients {
    primary: string[];
    secondary: string[];
  }
  
  export const GRADIENTS: Gradients = {
    primary: ['#5BABAD', '#3C9597', '#14787A'],
    secondary: ['#3C9597', '#1F7F81'],
  };
  