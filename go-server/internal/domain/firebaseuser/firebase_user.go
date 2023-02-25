package firebaseuser

type firebaseUser struct {
	FirebaseTokenVerification
	id    FirebaseUserID
	uid   FirebaseUserUID
	email FirebaseUserEmail
}

type FirebaseUser interface {
	FirebaseTokenVerification
	ID() FirebaseUserID
	UID() FirebaseUserUID
	Email() FirebaseUserEmail
}

func (f firebaseUser) ID() FirebaseUserID {
	return f.id
}

func (f firebaseUser) UID() FirebaseUserUID {
	return f.uid
}

func (f firebaseUser) Email() FirebaseUserEmail {
	return f.email
}

func NewFirebaseUser(firebaseTokenVerification FirebaseTokenVerification, id, uid, email string) (FirebaseUser, error) {
	firebaseID, err := NewFirebaseUserID(id)
	if err != nil {
		return nil, err
	}
	firebaseUID, err := newFirebaseUserUID(uid)
	if err != nil {
		return nil, err
	}
	firebaseEmail, err := newFirebaseUserEmail(email)
	if err != nil {
		return nil, err
	}
	return &firebaseUser{
		FirebaseTokenVerification: firebaseTokenVerification,
		id:                        firebaseID,
		uid:                       firebaseUID,
		email:                     firebaseEmail,
	}, nil
}
