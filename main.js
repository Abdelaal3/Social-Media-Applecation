let posts = document.getElementById('posts');
let login = document.getElementById('login');
let register = document.getElementById('register');
let userName = document.getElementById('recipient-name');
let password = document.getElementById('password');
let LoginModal = document.getElementById('LoginModal');
let modal = document.getElementById('LogModal');
let logOut = document.getElementById('logOut');

let rgistername = document.getElementById('Regname');
let Regusername = document.getElementById('Regusername');
let email = document.getElementById('Regemail');
let Regpassword = document.getElementById('Regpassword');
let Regimage = document.getElementById('Regimage')
let Registerbtn = document.getElementById('RegModal');

let HeadingUsername = document.getElementById('HUsername');







//SHOW
async function Get()
{
    try {
        let response = await axios.get('https://tarmeezacademy.com/api/v1/posts?limit=7');

        // استخراج البيانات من الاستجابة
        let postsContent = '';
        let postsData = response.data.data;

    posts.innerHTML =[]; // امسح المنشورات القديمة



    for(let i = 0; i < response.data.data.length; i++)
        {
         let postTitle = response.data.data[i].title || '';

            posts.innerHTML +=
            `
            <div class="card shadow mb-4">
                        <div class="card-header">
                            <img class="img-thumbnail rounded-circle" style="width: 65px; height: 65px;" src="profile-pics/abdelaal.jpg" alt="">
                            <b> @${response.data.data[i].author.username}</b>
                        </div>
                        <div class="card-body">
                            <div class="imagePost pb-2">
                               <img class="rounded w-100"  src=""  alt="">
                                <p style="color: rgb(112, 112, 112); font-family:'Times New Roman', Times, serif;"> ${response.data.data[i].created_at}</p>
                            </div>
                            <h5 class="card-title">${postTitle}</h5>
                            <p class="card-text">${response.data.data[i].body}</p>
                            <hr>
                            <div class="comments">
                                <i class="bi bi-chat-right-quote"></i>
                                <span>(${response.data.data[i].comments_count}) Comments</span>
                                <span id="post-tags-${response.data.data[i].id}">
                                   
                                </span>
                                
                            </div>
                        </div>
                    </div>
            `
           

            let tags = document.getElementById(`post-tags-${response.data.data[i].id}`);
            tags.innerHTML= "";
            for (let i = 0 ; i < 2;i++)
                {
                    tags.innerHTML += `
                     <button class="btn btn-sm rounded-5"  style= " background-color: rgb(185, 242, 252);padding: 5px; border-radius: 10px;   margin-left: 5px;">                                                                                                                                                                                                                                                                                                                        
                          sports
                    </button>
                    `
                }


            
        }

}
catch (error) {
    console.error('خطأ أثناء جلب البيانات:', error);
}
};



//Log in 
LoginModal.onclick = function()
{
    //collect  data
    const user= {
        username: userName.value.trim(),
        password: password.value.trim(),
    }
    //Send data To Api To Check
    axios.post('https://tarmeezacademy.com/api/v1/login',user)
    .then (function(response){
        let token = response.data.token;
        let user = JSON.stringify(response.data.user)


       localStorage.setItem('token' , token );
       localStorage.setItem('user' , user );
       console.log(response.data.user.name)


       const modalInstance = bootstrap.Modal.getInstance(modal);
       modalInstance.hide()
       showAlert("Logged in successfully ✅", "success");
       setupUi();
       updateUsername();
    
    })
    .catch(error => {
        console.error("خطأ في تسجيل الدخول:", error.response?.data || error.message);
        alert("فشل تسجيل الدخول! تأكد من البيانات.");
    });
};


// Display User Name 

function updateUsername() {
    let user = localStorage.getItem("user");
    if (user) {
        let userData = JSON.parse(user);
        HeadingUsername.innerHTML = `@${userData.name}`;
    } else {
        HeadingUsername.innerHTML = ""; // امسح الاسم لو المستخدم غير مسجل
    }
}


// Register 

Registerbtn.onclick= function()
{
const NewUser = {
    username: Regusername.value.trim(),
    password: Regpassword.value.trim(),
    name: rgistername.value.trim(),
    email: email.value.trim(),
}

    axios.post ('https://tarmeezacademy.com/api/v1/register', NewUser)
    .then(function(response){
       
        console.log(response)
        let token = response.data.token;
        let user = JSON.stringify(response.data.user);
       localStorage.setItem('token' , token );
       localStorage.setItem('user' , user );
       const modalInstance = bootstrap.Modal.getInstance(RegisterModal);
       modalInstance.hide()
       showAlert("Created user and logged in successfully ✅", "success");
       setupUi()
       HeadingUsername.innerHTML = userName


    })
    .catch(error => {
        console.error("خطأ في التسجيل :", error.response?.data || error.message);
        showAlert("Register failed! Please check your username and email.", "danger");
    });
};

// Alert
function showAlert(message, type = "success") {
    const alertPlaceholder = document.getElementById("alertSucc");

    if (!alertPlaceholder) {
        console.error("⚠️ العنصر alertSucc غير موجود في الـ HTML!");
        return;
    }

    // تحديد لون التنبيه بناءً على النوع
    const alertClass = `alert-${type}`; // success, danger, warning, info...

    // إنشاء التنبيه داخل alertPlaceholder مباشرة
    alertPlaceholder.innerHTML = `
        <div id="customAlert" class="alert ${alertClass} alert-dismissible fade show" role="alert">
            <div>${message}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    // إخفاء التنبيه بعد 3 ثواني
    setTimeout(() => {
        const alertDiv = document.getElementById("customAlert");
        if (alertDiv) {
            alertDiv.classList.remove("show"); // إزالة show لبدء تأثير fade
            setTimeout(() => {
                if (alertDiv) {
                    alertDiv.remove(); // حذف العنصر نهائيًا بعد انتهاء تأثير fade
                }
            }, 500); // انتظار نصف ثانية بعد إزالة show لضمان تأثير الاختفاء
        }
    }, 3000);
}

// End Alert

// Setup Ui

function setupUi()
{
    const token = localStorage.token
    if (token == null){
        login.style.display = '';
        register.style.display = '';
        logOut.style.display = 'none';
    } else{
        login.style.display = 'none';
        register.style.display = 'none';
        logOut.style.display = 'block';
    }
}

// Function Log out 

function logout()
{
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showAlert("Logged  successfully ✅", "success");
    setupUi();
    updateUsername();


}

Get();
setupUi();
updateUsername();



