// User Profile Info
let USEREMAIL = document.getElementById('USEREMAIL');
let USERENAME = document.getElementById('USERENAME');
let Nickname = document.getElementById('Nickname');
let ProfilBTN = document.getElementById('ProfilBTN');
let USERINFO = JSON.parse(localStorage.getItem('user'))
let MainUSerInfo = document.getElementById('MainUSerInfo');
let posts = document.getElementById('posts');
const baseUrl = 'https://tarmeezacademy.com/api/v1'
let currentPage = 1;
let lastPage = 1;
let isLoading = false; 
let UpdateProfileBTN = Registerbtn;

function GetCurrrentUSER (){
    let urlParams =  new URLSearchParams(window.location.search)

    let id = urlParams.get("userid");
    return id ;
}

async function GetUserPost()
{
    const ID = GetCurrrentUSER ()
    try{
        let response = await axios.get (`${baseUrl}/users/${ID}/posts`)
        posts.innerHTML = '';
        let postsData = response.data.data;

           // عكس ترتيب البيانات لاستخدام البوستات الأحدث أولاً  
           postsData.reverse(); // عكس ترتيب المصفوفة
        
        for (let i = 0; i < postsData.length; i++) {
            let post = postsData[i];
            let author = post.author;
            let postTitle = post.title || '';

            // Show Or Hid (Edit Btn)
            let user = GetCurrentUser();
            let isMyPost = user != null && author.id  == user.id ;
            let EditBtnContent = '';
            let DeleteBtnContent = '';

            if (isMyPost){
                EditBtnContent = `<i onclick="EditPostBtn(JSON.parse(this.getAttribute('data-post')))" class="bi bi-pencil" style="float:right; cursor:pointer" 
                        data-post='${JSON.stringify(post).replace(/"/g, "&quot;")}'>
                      </i>`
                DeleteBtnContent = `<i onclick="DeleteIcon(JSON.parse(this.getAttribute('data-post')))" class="bi bi-x-circle" style="float:right; cursor:pointer;margin-right: 14px;" 
                        data-post='${JSON.stringify(post)}'></i>`       
            } 

            // Check image != null
            let profileImageHTML = (author.profile_image && typeof author.profile_image === "string" && author.profile_image.trim() !== "")
                ? `<img class="img-thumbnail rounded-circle" style="width: 50px; height: 50px;" src="${author.profile_image}" alt="${author.username}">`
                : ''; 

            let postImageHTML = (post.image && typeof post.image === "string" && post.image.trim() !== "")
                ? `<img class="rounded w-100" src="${post.image}" alt="${postTitle}">`
                : ''; 

            posts.innerHTML += `
                <div class="card shadow mb-4">
                    <div class="card-header">
                        ${profileImageHTML} <!-- صورة البروفايل إن وجدت -->
                        <b>@${author.username}</b>
                         ${EditBtnContent}
                        ${DeleteBtnContent}
                    </div>
                    <div class="card-body" onclick="ClickedPost(${post.id})" style = "cursor: pointer;" ">
                        <div class="imagePost pb-2">
                            ${postImageHTML} <!-- صورة البوست إن وجدت -->
                            <p style="color: rgb(112, 112, 112); font-family:'Times New Roman', Times, serif;">
                                ${post.created_at}
                            </p>
                        </div>
                        <h5 class="card-title">${postTitle}</h5>
                        <p class="card-text">${post.body}</p>
                        <hr>
                        <div class="comments">
                            <i class="bi bi-chat-right-quote"></i>
                            <span>(${post.comments_count}) Comments</span>
                            <span id="post-tags-${post.id}"></span>
                        </div>
                    </div>
                </div>
            `;

            let tags = document.getElementById(`post-tags-${post.id}`);
            tags.innerHTML = "";

            if (post.tags && post.tags.length > 0) {
                for (let j = 0; j < 3; j++) {
                    tags.innerHTML += `
                    <button class="btn btn-sm rounded-5" style="background-color: rgb(185, 242, 252); padding: 5px; border-radius: 10px; margin-left: 5px;">
                    
                    ${response.data.data[j].tags}
    
                    </button>
                `;
                    
                }
    
            }
            
            }     

    } catch (error) {
        console.error('خطأ أثناء جلب البيانات:', error);
    }
}




GetUserPost()



function GetDataUser(){
    ToggleLoader(true)
    const ID = GetCurrrentUSER ()
    axios.get(`${baseUrl}/users/${ID}`)
    .then (function(response){
        ToggleLoader(false)
        const user = response.data.data;
        
        // Show Or Hid (Edit Btn)
        let OwnerUser = ProfileOwner();
        let isMyProfile = user != null && OwnerUser.id  == user.id ;
         let EditProfileIcon = '';
        
         if (isMyProfile) {
            EditProfileIcon = `<i onclick="EditProfile(${user.id})" style="float: inline-end; font-size: 30px; cursor:pointer" class="bi bi-pencil-square"></i>`;
        }
        console.log( 'This is User', user)
       
        MainUSerInfo.innerHTML += `
                  <h1>${user.name}'s Profile</h1>

                    <div class="card shadow mb-4">
                    
                        <div class="card-body">
                            ${EditProfileIcon}

                            <div class="row">
                                <!-- User Image Col -->
                                 <div class="col-2">
                                    <img class="img-thumbnail rounded-circle" style="width: 100px; height: 100px;" id="headerImg" src="${user.profile_image}" alt="">
                                 </div>
                                <!-- //User Image Col// -->
                                <!-- User Name & Email Col -->
                                 <div class="col-4" style="display: flex; flex-direction: column; justify-content: space-evenly;">
                                      <!--Email-->
                                      <div class="email">
                                        <h6 id="USEREMAIL">${user.email}</h6>
                                      </div>
                                      <!--UserName-->
                                      <div class="UserNAme">
                                        <h6 id="USERNAME">${user.name}</h6>
                                      </div>
                                      <!--Email-->
                                      <div class="Nickname">
                                       <h6 id="Nickname">@${user.username}</h6>
                                      </div>
                                     
                                 </div>
                                <!-- //User Name & Email Col// -->

                                <!-- Posts and Comment Count -->
                                 <div class="col-4"style="display: flex; flex-direction: column; justify-content: space-evenly;">
                                    <div class="numberInfo">
                                      <span id="PostsCont">${user.posts_count}</span> Posts
                                    </div>
                                    <div class="numberInfo">
                                      <span id="CommentsCont">${user.comments_count}</span> Comments
                                    </div>
                                 </div>
                                <!-- //Posts and Comment Count// -->

                            </div>

                           
                        </div>
                    </div>    
        `

    })


    
}
   



GetDataUser()




function EditProfile(UserID)
{
    let ID = UserID;
    document.getElementById('RegTitle').innerHTML = 'Update Your Profile';
    Registerbtn.innerHTML = 'Update';
    document.getElementById('Reglogin').style.display = 'none'
    let PostModal = new bootstrap.Modal(document.getElementById('RegisterModal') , {});
    PostModal.show();
    
 
}

// Profile Owner Function
function ProfileOwner() {
    return JSON.parse(localStorage.getItem("user")); // يجب أن تخزن بيانات المستخدم كـ JSON
}





