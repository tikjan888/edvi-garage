// Скрипт для создания администратора
// Запустите в консоли браузера: makeAdmin('tikjan1983@gmail.com')

window.makeAdmin = async (email) => {
  try {
    // Импортируем Firebase
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js")
    const { getFirestore, collection, getDocs, doc, updateDoc, Timestamp } = await import(
      "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"
    )

    // Конфигурация Firebase (замените на вашу)
    const firebaseConfig = {
      // Ваша конфигурация Firebase
    }

    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)

    const usersSnapshot = await getDocs(collection(db, "users"))

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data()
      if (userData.email && userData.email.toLowerCase() === email.toLowerCase()) {
        await updateDoc(doc(db, "users", userDoc.id), {
          role: 1,
          updatedAt: Timestamp.now(),
        })
        console.log(`✅ Пользователь ${email} назначен администратором`)
        return
      }
    }

    console.log(`❌ Пользователь с email ${email} не найден`)
  } catch (error) {
    console.error("Ошибка:", error)
  }
}

console.log("Для назначения администратора выполните: makeAdmin('tikjan1983@gmail.com')")
