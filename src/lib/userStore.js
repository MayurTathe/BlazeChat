import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand'
import { db } from './firebase';
import { toast } from 'react-toastify';

export const useUserStore = create((set) => ({
    currentUser: null,
    isLoading: true,
    userLogged: false,
    fetchUserInfo: async (uid) => {

        if (!uid) {
            set({ currentUser: null, isLoading: false, userLogged: false });
            console.log("If uid is not present!");
            return;
        }

        try {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                set({ currentUser: docSnap.data(), isLoading: false, userLogged: true });
                console.log(docSnap.data());
            } else {
                set({ currentUser: null, isLoading: false, userLogged: false });
            }
            // console.log(currentUser);
        }
        catch (error) {
            console.error("Error fetching user info:", error);
            return set({ currentUser: null, isLoading: false, userLogged: false });
        }
    }
}))