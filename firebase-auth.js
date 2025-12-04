// Firebase Authentication Service

class FirebaseAuthService {
    constructor() {
        this.auth = firebase.auth();
        this.db = firebase.firestore();
    }

    // Register new user
    async registerUser(email, password, userData) {
        try {
            const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Save additional user data to Firestore
            await this.db.collection('users').doc(user.uid).set({
                ...userData,
                email: email,
                uid: user.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            return { success: true, user: user, userData: { ...userData, uid: user.uid } };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

    // Login user
    async loginUser(email, password) {
        try {
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Get user data from Firestore
            const userDoc = await this.db.collection('users').doc(user.uid).get();
            const userData = userDoc.data();

            return { success: true, user: user, userData: userData };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

    // Logout user
    async logoutUser() {
        try {
            await this.auth.signOut();
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    }

    // Get current user
    getCurrentUser() {
        return this.auth.currentUser;
    }

    // Listen to auth state changes
    onAuthStateChanged(callback) {
        return this.auth.onAuthStateChanged(callback);
    }

    // Update user profile
    async updateUserProfile(updates) {
        try {
            const user = this.auth.currentUser;
            if (!user) throw new Error('No user logged in');

            await this.db.collection('users').doc(user.uid).update({
                ...updates,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            return { success: true };
        } catch (error) {
            console.error('Update profile error:', error);
            return { success: false, error: error.message };
        }
    }

    // Get user data
    async getUserData(uid) {
        try {
            const userDoc = await this.db.collection('users').doc(uid).get();
            if (userDoc.exists) {
                return { success: true, data: userDoc.data() };
            } else {
                return { success: false, error: 'User not found' };
            }
        } catch (error) {
            console.error('Get user data error:', error);
            return { success: false, error: error.message };
        }
    }

    // Error message mapping
    getErrorMessage(errorCode) {
        const errorMessages = {
            'auth/email-already-in-use': 'البريد الإلكتروني مستخدم بالفعل',
            'auth/weak-password': 'كلمة المرور ضعيفة جداً',
            'auth/invalid-email': 'البريد الإلكتروني غير صحيح',
            'auth/user-not-found': 'المستخدم غير موجود',
            'auth/wrong-password': 'كلمة المرور غير صحيحة',
            'auth/network-request-failed': 'خطأ في الشبكة، تحقق من اتصالك بالإنترنت',
            'auth/too-many-requests': 'تم حظر هذا الحساب مؤقتاً بسبب محاولات تسجيل دخول كثيرة'
        };

        return errorMessages[errorCode] || 'حدث خطأ غير متوقع';
    }
}

// Create global instance
const authService = new FirebaseAuthService();
window.authService = authService;
