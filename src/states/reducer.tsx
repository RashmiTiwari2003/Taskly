export interface State {
    userName: string;
    userEmail: string;
    userPhone: string;
    userPassword: string;
    userRole: string;
    businessName:string;
    passwordError: boolean;
    showPassword: boolean;
    phoneError: boolean;
}

type Action =
    | { type: 'SET_USER_NAME'; payload: string }
    | { type: 'SET_USER_EMAIL'; payload: string }
    | { type: 'SET_USER_PHONE'; payload: string }
    | { type: 'SET_USER_PASSWORD'; payload: string }
    | { type: 'SET_USER_ROLE'; payload: string }
    | { type: 'SET_BUSINESS_NAME'; payload: string }
    | { type: 'TOGGLE_SHOW_PASSWORD' };

export const initialState = {
    userName: '',
    userEmail: '',
    userPhone: '',
    userPassword: '',
    userRole: '',
    businessName: '',
    passwordError: false,
    showPassword: false,
    phoneError: false,
};

export const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'SET_USER_NAME':
            return { ...state, userName: action.payload };
        case 'SET_USER_EMAIL':
            return { ...state, userEmail: action.payload };
        case 'SET_USER_PHONE':
            return { ...state, userPhone: action.payload, phoneError: action.payload.length != 10 };
        case 'SET_USER_PASSWORD':
            return { ...state, userPassword: action.payload, passwordError: action.payload.length < 6 };
        case 'SET_USER_ROLE':
            return { ...state, userRole: action.payload };
        case 'SET_BUSINESS_NAME':
            return { ...state, businessName: action.payload };
        case 'TOGGLE_SHOW_PASSWORD':
            return { ...state, showPassword: !state.showPassword };
        default:
            return state;
    }
};
