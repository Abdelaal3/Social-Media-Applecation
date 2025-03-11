let login = document.getElementById('login');
let register = document.getElementById('register');
let userName = document.getElementById('recipient-name');
let password = document.getElementById('password');
let LoginModal = document.getElementById('LoginModal');
let modal = document.getElementById('LogModal');
let AddPostmodal = document.getElementById('AddPost');
let logOut = document.getElementById('logOut');
let rgistername = document.getElementById('Regname');
let Regusername = document.getElementById('Regusername');
let regemail = document.getElementById('Regemail');
let Regpassword = document.getElementById('Regpassword');
let Regimage = document.getElementById('Regimage')
let Registerbtn = document.getElementById('RegModal');
let HeadingUsername = document.getElementById('HUsername');
let Postbtn = document.getElementById('Postbtn');
let Title= document.getElementById('title');
let txt= document.getElementById('txt');
let imgPost= document.getElementById('img2');
let AddPostIcon = document.getElementById('plusPost');
let UserImage = document.getElementById('usrImg');
let ProfileImg = document.getElementById('ProfileImg');
let SinglePosts = document.getElementById('SinglePosts');
let buttonSend= document.getElementById('buttonSend');
let mood = 'create';
let DeleteBtn = document.getElementById('DeleteBtn');

//Log in 
LoginModal.onclick = function()
{
    //collect  data
    const user= {
        username: userName.value.trim(),
        password: password.value.trim(),
    }
    ToggleLoader(true)
    //Send data To Api To Check
    axios.post('https://tarmeezacademy.com/api/v1/login',user)
    .then (function(response){
        ToggleLoader(false)
        let token = response.data.token;
        let user = JSON.stringify(response.data.user)


       localStorage.setItem('token' , token );
       localStorage.setItem('user' , user );


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


// Display User Name and profile picture
function updateUsername() {
    let user = localStorage.getItem("user");
    if (user) {
        let userData = JSON.parse(user);
        HeadingUsername.innerHTML = `@${userData.username}`;
        if (userData.profile_image) {
            UserImage.src = userData.profile_image;
            UserImage.style.display = "block"; // إظهار الصورة
        } else {
            UserImage.style.display = "none"; // إخفاء الصورة لو مفيش صورة
        }
    } else {
        HeadingUsername.innerHTML = ""; // امسح الاسم لو المستخدم غير مسجل
        UserImage.style.display = "none";
        
    }
};


// Register 
// عند الضغط على زر التسجيل/التحديث
Registerbtn.onclick = function () {
    let user = localStorage.getItem("user"); // جلب بيانات المستخدم من Local Storage
    let isUpdate = user ? true : false; // تحديد هل المستخدم مسجل أم لا
    handleUserAction(isUpdate);
};

function handleUserAction(isUpdate) {
    const username = Regusername.value.trim();
    const password = Regpassword.value.trim();
    const name = rgistername.value.trim();
    const email = regemail.value.trim();
    const image = ProfileImg.files;

    let formData = new FormData();
    formData.append("username", username);
    formData.append("name", name);
    formData.append("email", email);

    // كلمة المرور مطلوبة فقط في التسجيل
    if (!isUpdate && password) {
        formData.append("password", password);
    }

    if (image.length > 0) {
        formData.append("image", image[0]);
    }

    let url, method, headers;
    if (isUpdate) {
        url = "https://tarmeezacademy.com/api/v1/updatePorfile";
        method = "PUT";
        headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
    } else {
        url = "https://tarmeezacademy.com/api/v1/register";
        method = "POST";
        headers = {};
    }
    ToggleLoader(true)
    axios({
        method: method,
        url: url,
        data: formData,
        headers: headers
    })
        .then(function (response) {
            ToggleLoader(false)
            console.log(response);
            let user = JSON.stringify(response.data.user);
            localStorage.setItem("user", user);

            if (!isUpdate) {
                let token = response.data.token;
                localStorage.setItem("token", token);
            }

            const modalInstance = bootstrap.Modal.getInstance(RegisterModal);
            modalInstance.hide();
            showAlert(
                isUpdate ? "Profile updated successfully ✅" : "User registered successfully ✅",
                "success"
            );

            // ✅ تحديث البيانات على الصفحة بدون ريفريش
            updateProfileUI(response.data.user);

            // 🔄 تحديث الصفحة بعد النجاح (اختياري)
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        })
        .catch(error => {
            console.error("خطأ :", error.response?.data || error.message);
            showAlert(
                isUpdate ? "Update failed! Please check your input." : "Register failed! Please check your username and email.",
                "danger"
            );
        });
}

// ✅ تحديث البيانات على الواجهة بدون ريفريش
function updateProfileUI(user) {
    let profileNameElement = document.querySelector("#profileName");
    let profileEmailElement = document.querySelector("#profileEmail");
    let profileImageElement = document.querySelector("#profileImage");

    if (profileNameElement) profileNameElement.textContent = user.name;
    if (profileEmailElement) profileEmailElement.textContent = user.email;
    if (profileImageElement && user.image) profileImageElement.src = user.image;
}


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
};
// End Alert

// Setup Ui
function setupUi()
{
    const token = localStorage.token
    if (token == null){
        login.style.display = '';
        register.style.display = '';
        logOut.style.display = 'none';
        AddPostIcon.style.display = '';
    } else{
        login.style.display = 'none';
        register.style.display = 'none';
        logOut.style.display = 'block';
        AddPostIcon.style.display = 'block';
    }
};

// Function Show Single Post

let urlParams =  new URLSearchParams(window.location.search)

let id = urlParams.get("postId");
async function GetSinglePost()
{
    ToggleLoader(true)
    const response= await axios.get(`https://tarmeezacademy.com/api/v1/posts/${id}`)
    .then(function(response){
        ToggleLoader(false)
        SinglePosts.innerHTML = '';

        const post = response.data.data;
        const comments = post.comments;
        const author = post.author;

        document.title = `${author.username}'s post`

        // Show Or Hid (Edit Btn)
        let user = GetCurrentUser();
        let isMyPost = user != null && author.id  == user.id ;
        let EditBtnContent = '';
        let DeleteBtnContent = '';

        

        if (isMyPost){
            EditBtnContent = `<i onclick="EditBtnContent(JSON.parse(this.getAttribute('data-post')))" class="bi bi-pencil" style="float:right; cursor:pointer" 
                    data-post='${JSON.stringify(post).replace(/"/g, "&quot;")}'>
                  </i>`;
            DeleteBtnContent = `<i onclick="DeleteIcon(JSON.parse(this.getAttribute('data-post')))" class="bi bi-x-circle" style="float:right; cursor:pointer;margin-right: 14px;" 
                        data-post='${JSON.stringify(post)}'></i>`
        } 

    
        SinglePosts.innerHTML += `
        <!-- Single Post -->
                    <h2 class="pb-4">
                    <span>${author.username}'s</span>
                    Post
                    </h2>
                <div class="card shadow mb-4">
                    <div class="card-header">
                        <img class="img-thumbnail rounded-circle" style="width: 65px; height: 65px;" src="${author.profile_image}" alt="${author.username}">
                        <b>@${author.username}</b>
                        ${EditBtnContent}
                        ${DeleteBtnContent}
                    </div>
                    <div class="card-body">
                        <div class="imagePost pb-2">
                            <img class="rounded w-100"  src="${post.image}"  alt="">
                            <p style="color: rgb(112, 112, 112); font-family:'Times New Roman', Times, serif;"> ${post.created_at}</p>
                        </div>
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text">${post.body}</p>
                        <hr>
                        <div class="comments">
                            <i class="bi bi-chat-right-quote"></i>
                            <span class="mx-1">(${post.comments_count}) Comments</span>
                            <span id="post-tags-${post.id}"></span>
                        </div>
                    </div>
                    <div id="CommentsContainer">
                
                    </div>
                    <div class="input-group mb-3">
                    <input id="addComment" type="text" class="form-control p-4 w-75 m-1" placeholder="Add comment to ${author.username}" aria-label="Recipient's username" aria-describedby="button-addon2">
                    <button onclick="CreatComment()" class="btn btn-outline-secondary border-0" type="button" id="buttonSend"><i class="bi bi-send "></i></button>
                    </div>

                </div> 
    `; 

            let CommentsContainer = document.getElementById('CommentsContainer');

            CommentsContainer.innerHTML = "";

            for (let i= 0; i < post.comments.length; i++){

                let safeText = post.comments[i].body.replace(/'/g, "\\'").replace(/"/g, "&quot;");
                CommentsContainer.innerHTML += `
                        <!-- Single Comment -->
                            <div class="p-3" style="background-color: rgb(255 255 255);margin-top: 0px;">
                                <!-- User Profile  -->
                                <div class="UserProfile">
                                <img class="img-thumbnail rounded-circle" style="width: 50px; height: 50px;" src="${post.comments[i].author.profile_image}" alt="">
                                <span style="font-weight: 600;">${post.comments[i].author.username}</span> 
                                </div>
                                <div class="mb-4" style = "display:flex;justify-content: space-between;align-items: center;">
                                <p class="m-3 p-3" style="background-color: rgb(248, 248, 248); border-radius: 25px; width: 100%">${safeText}</p>
                                </div>
                                </div>
                            <!-- Single Comment -->   
                `
        }
        

            
       
        let tags = document.getElementById(`post-tags-${post.id}`);
        tags.innerHTML = "";
        for (let j = 0; j < post.tags.length; j++) {
            tags.innerHTML += `
                <button class="btn btn-sm rounded-5" style="background-color: rgb(185, 242, 252); padding: 5px; border-radius: 10px; margin-left: 5px;">
                
                ${post.tags[j].name}

                </button>
            `;
        }
        
                // Event Listener على زر Enter
                let addComment = document.getElementById('addComment');
                addComment.addEventListener("keydown", function (event) {
                    if (event.key === "Enter") {
                        event.preventDefault(); // منع السطر الجديد في textarea
                        CreatComment(); // استدعاء الدالة
                        showAlert('Comment Posted')
                    }
                });


})
}


// Function Log out 
function logout()
{
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showAlert("Logged successfully ✅", "success");
    setupUi();
    updateUsername();


};


// Creat A Post
Postbtn.onclick = function()
{
    
    let PostId =  document.getElementById('Post_Id_input').value ;     

    let IsCreate = PostId === null || PostId === ''

    const image= imgPost.files;
    const body= txt.value.trim();
    const title= Title.value.trim();
    let formData  = new FormData()
    formData.append("title" , title);
    formData.append("body" , body);

    if (image.length > 0 ){
    formData.append("image" , image[0]);

    }


    const headers ={
        'Authorization': `Bearer ${localStorage.getItem("token")}`, // جلب التوكن من Local Storage
    }

    if (IsCreate){
        ToggleLoader(true)
        axios.post('https://tarmeezacademy.com/api/v1/posts' , formData, {headers:headers}
        )
       .then((response)=>{
            ToggleLoader(false)
           console.log(response.data)
           const modalInstance = bootstrap.Modal.getInstance(AddPostmodal);
           modalInstance.hide()
           showAlert("Post created successfully ✅",);
           if (window.location.pathname.includes("index.html")) {
            Get(true, 1);
            window.scrollTo({
                top: 0,
                behavior: "smooth" 
            })
           }else {
            setTimeout(() => {
                window.location = 'index.html'
                window.scrollTo({
                    top: 0,
                    behavior: "smooth" 
                })
      
            }, 1500);
            
           }
           
          
       })
       .catch(error => {
           const message = error.response.data.message
           showAlert(message, "danger");
       });
    }
    //Edit Post
     else
    {
        formData.append("_method" , "put");
        axios.post(`https://tarmeezacademy.com/api/v1/posts/${PostId}` , formData, {headers:headers}
            )
            .then((response)=>{

                 // ✅ استخراج البيانات الجديدة من الـ response
            let updatedPost = response.data.data;
            let updatedTitle = updatedPost.title;
            let updatedBody = updatedPost.body;
            let updatedImage = updatedPost.image; // لو فيه صورة جديدة

            // ✅ تحديث العنوان والمحتوى في الصفحة بدون ريفريش
            let postTitleElement = document.querySelector(".card-title");
            let postBodyElement = document.querySelector(".card-text");
            let postImageElement = document.querySelector(".imagePost img");

            if (postTitleElement) postTitleElement.textContent = updatedTitle;
            if (postBodyElement) postBodyElement.textContent = updatedBody;
            if (postImageElement && updatedImage) postImageElement.src = updatedImage; // تحديث الصورة لو تم تغييرها
                const modalInstance = bootstrap.Modal.getInstance(AddPostmodal);
                modalInstance.hide()
                showAlert("Post Edit successfully ✅",);

                if (window.location.pathname.includes("index.html")) {
                    Get(true, 1);
                    window.scrollTo(0, 0);
                   }else {
                    window.location = 'index.html'
                   }

                ClickedPost(PostId)
            })
            .catch(error => {
                const message = error.response.data.message
                showAlert(message, "danger");
            });
    }
   
    
};
// Create Comment
async function CreatComment()
{
    let addComment= document.getElementById('addComment');
    let commentText = addComment.value.trim();
    const comment = {
        body: commentText
    };
    const headers ={
        'Authorization': `Bearer ${localStorage.getItem("token")}`, // جلب التوكن من Local Storage
    }

    if (!commentText) {
        showAlert('The Comment is empty', type = "danger" )
        return; 
    }
    try {
        ToggleLoader(true)
        const response = await axios.post(`https://tarmeezacademy.com/api/v1/posts/${id}/comments`, comment, { headers });
        ToggleLoader(false)
        addComment.value = ""; 
        showAlert('Comment Posted')
        GetSinglePost();
    } catch (error) {
        console.error(error.response?.data || error.message);
        showAlert(error.message ,type = "danger" )
    }
}

//Edit Post
function EditPostBtn( Post)
{
    document.getElementById('PostModalTitle').innerHTML = 'Edit Post'
    let PostModal = new bootstrap.Modal(document.getElementById('AddPost') , {});
    PostModal.show();
    
    document.getElementById('Post_Id_input').value = Post.id
    document.getElementById('title').value = Post.title;
    document.getElementById('txt').value = Post.body;
    document.getElementById('Postbtn').innerHTML = 'Update';
    document.getElementById('imglabel').style.display = 'none';
    document.getElementById('img2').style.display = 'none';
    GetSinglePost();
}

// Add Post Icon
function AddIcon(){
    document.getElementById('PostModalTitle').innerHTML = 'Add Post'
    let PostModal = new bootstrap.Modal(document.getElementById('AddPost') , {});
    PostModal.show();
    document.getElementById('title').value = '';
    document.getElementById('txt').value = '';
    document.getElementById('Postbtn').innerHTML = 'Post';
    document.getElementById('Post_Id_input').value = ''
}

// Current user
function GetCurrentUser()
{
    let user = null
    const StorageUser = localStorage.getItem('user')
    if (StorageUser != null){
        user =JSON.parse(StorageUser)
    }
    return user;
}

//Delete Icon 
let POOstId = '';
let DeleteModal; 
function DeleteIcon(Post){
    POOstId = Post.id
    console.log(POOstId)
    DeleteModal = new bootstrap.Modal(document.getElementById('DeleteModal') , {});
    DeleteModal.show();
}

// Delete Post 
DeleteBtn.onclick = function DeletePostBtn()
{

    console.log(POOstId)
    const headers ={
        'Authorization': `Bearer ${localStorage.getItem("token")}`, // جلب التوكن من Local Storage
    }
    ToggleLoader(true)
   axios.delete (`https://tarmeezacademy.com/api/v1/posts/${POOstId}` , {headers:headers})
   .then (function(response){
    ToggleLoader(false)
    console.log(response)
    showAlert('The Post Deleted', type = "success")
    DeleteModal.hide();
    if (window.location.pathname.includes("index.html")) {
        Get(true, 1); // تحديث الصفحة الرئيسية بعد الحذف
       

    } else if (window.location.pathname.includes("postdetails.html")) {
        setTimeout(() => {
            window.location = 'index.html'
            window.scrollTo({
                top: 0,
                behavior: "smooth" // يجعل التمرير سلسًا
            })
  
        }, 1500);
    }
    else {

        setTimeout(() => {
            window.location.reload()
            window.scrollTo({
                top: 0,
                behavior: "smooth" // يجعل التمرير سلسًا
            })
  
        }, 1500);

    }
   })
}





function profleClicked (){
    const user = GetCurrentUser ()
    const ID =user.id
     window.location = `profile.html?userid=${ID}`
}



// Loader 

let Loader = document.getElementById('Loader')

function ToggleLoader(Show =true){

    if (Show){
        Loader.style.visibility = 'visible'
    }else{
        Loader.style.visibility = 'hidden'
    }
}






GetSinglePost();
setupUi();
updateUsername();



