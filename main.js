let posts = document.getElementById('posts');
const baseUrl = 'https://tarmeezacademy.com/api/v1'
let currentPage = 1;
let lastPage = 1;
let isLoading = false; 

let PROFBTN = document.getElementById('PROF')

// === Infinte Scroll ==== //
window.addEventListener("scroll", function() {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight - 100; // تحسين الحساب

    if (endOfPage && currentPage < lastPage && !isLoading) {
        isLoading = true; // منع التكرار أثناء تحميل البيانات
        currentPage++;

        Get(false, currentPage).then(() => {
            isLoading = false; // بعد اكتمال التحميل، السماح بطلب جديد
        });

    }
})
// ===// Infinte Scroll //==== //

//SHOW Posts 
async function Get(reload = false ,page = 1) {
    ToggleLoader(true)
    try {
        let response = await axios.get(`${baseUrl}/posts?limit=6&page=${page}`);
        ToggleLoader(false)
        lastPage = response.data.meta.last_page
        // Delete old posts
        if (reload == true){
        posts.innerHTML = '';

        }

        let postsData = response.data.data;

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
                ? `<img  onclick = "UserClicked(${author.id})" class="img-thumbnail rounded-circle" style="width: 50px; height: 50px;  cursor: pointer;" src="${author.profile_image}" alt="${author.username}">`
                : ''; 

            let postImageHTML = (post.image && typeof post.image === "string" && post.image.trim() !== "")
                ? `<img class="rounded w-100" src="${post.image}" alt="${postTitle}">`
                : ''; 

            posts.innerHTML += `
                <div class="card shadow mb-4">
                    <div class="card-header">
                        ${profileImageHTML} <!-- صورة البروفايل إن وجدت -->
                        <b  onclick = "UserClicked(${author.id})" style = " cursor: pointer;" >@${author.username}</b>
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
//Loading the data from API
document.addEventListener("DOMContentLoaded", function () {
    Get(true, 1); //Load When oppened
});
//Open Post in new page
function ClickedPost(postID)
{
   window.location = `postdetails.html?postId=${postID}`
}


function GetCurrrentUSER (){
    let urlParams =  new URLSearchParams(window.location.search)

    let id = urlParams.get("userid");
    return id ;
}

// Open User Profile
function UserClicked(UserID){
    const ID = UserID;
   window.location = `profile.html?userid=${ID}`
}


