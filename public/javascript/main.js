// lining through checked elements
        // $(".checkbox").on("change", function (event) {
        //     if (this.checked) {
        //         $(this).parent().css("text-decoration", "line-through");
        //         // localStorage.setItem(".checkbox", "my-divId");
        //     } else {
        //         $(this).parent().css("text-decoration", "none");
        //     }
        //     event.preventDefault();
        // });

        // handling button click events
        function action(id) {
            document.getElementById("label" + id).setAttribute("hidden", true)
            document.getElementById("edit" + id).setAttribute("hidden", true)
            document.getElementById("cancel" + id).removeAttribute("hidden")
            document.getElementById("update" + id).removeAttribute("hidden")
            document.getElementById("modify" + id).removeAttribute("hidden")
            document.getElementById("delete" + id).setAttribute("hidden", true)
        }

        // handling button click reverse events
        function reverseAction(id) {
            document.getElementById("modify" + id).setAttribute("hidden", true)
            document.getElementById("update" + id).setAttribute("hidden", true)
            document.getElementById("cancel" + id).setAttribute("hidden", true)
            document.getElementById("label" + id).removeAttribute("hidden")
            document.getElementById("edit" + id).removeAttribute("hidden")
            document.getElementById("delete" + id).removeAttribute("hidden")
        }

        // use timeOut() to fire our code after a set time...
        setTimeout(() => 
        { 
            $('.message').fadeOut();
        }, 8000
        );

        function showTooltip(id) {
            document.getElementById("tooltip" + id).removeAttribute("hidden");
        }

        function hideTooltip(id) {
            document.getElementById("tooltip" + id).setAttribute("hidden", true);
        }

        function showTitletip(id) {
            document.getElementById(id).removeAttribute("hidden");
        }

        function hideTitletip(id) {
            document.getElementById(id).setAttribute("hidden", true);
        }

        function showSignup() {
            document.getElementById("login").setAttribute("hidden", true);
            document.getElementById("signup").removeAttribute("hidden");
        }

        function showLogin() {
            document.getElementById("signup").setAttribute("hidden", true);
            document.getElementById("login").removeAttribute("hidden");
        }

        // Get elements by id to hide
        

            document.getElementById("loginVisibility").setAttribute("hidden", true);
            document.getElementById("signupVisibility").setAttribute("hidden", true);

            // Login and signup Password Show / Hide functionality
            function loginVisibility() {
                document.getElementById("loginVisibility").setAttribute("hidden", true);
                document.getElementById("loginInvisibility").removeAttribute("hidden");
                document.getElementById("login-password").setAttribute("type", "password");
            }

            function loginInvisibility() {
                document.getElementById("loginInvisibility").setAttribute("hidden", true);
                document.getElementById("loginVisibility").removeAttribute("hidden");
                document.getElementById("login-password").setAttribute("type", "text");
            }

            function signupVisibility() {
                document.getElementById("signupVisibility").setAttribute("hidden", true);
                document.getElementById("signupInvisibility").removeAttribute("hidden");
                document.getElementById("signup-password").setAttribute("type", "password");
            }

            function signupInvisibility() {
                document.getElementById("signupInvisibility").setAttribute("hidden", true);
                document.getElementById("signupVisibility").removeAttribute("hidden");
                document.getElementById("signup-password").setAttribute("type", "text");
            }

            function editProfile(){
                document.getElementById("editProfileNameEmail").removeAttribute("hidden");
                document.getElementById("cancel-edit-profile").style.display = "inline-block";
                document.getElementById("edit-profile").style.display = "none";
                document.getElementById("change-password").style.display = "none";
                document.getElementById("show-name").style.display = "none";
                document.getElementById("show-email").style.display = "none";
            }

            function cancelEditProfile(){
                document.getElementById("editProfileNameEmail").setAttribute("hidden", true);
                document.getElementById("cancel-edit-profile").style.display = "none";
                document.getElementById("edit-profile").style.display = "inline-block";
                document.getElementById("change-password").style.display = "inline-block";
                document.getElementById("show-name").style.display = "inline-block";
                document.getElementById("show-email").style.display = "inline-block";
            }
        
            function changePassword(){
                document.getElementById("changeProfilePassword").removeAttribute("hidden");
                document.getElementById("cancel-change-password").style.display = "inline-block";
                document.getElementById("edit-profile").style.display = "none";
                document.getElementById("change-password").style.display = "none";
                document.getElementById("show-name").style.display = "none";
                document.getElementById("show-email").style.display = "none";
            }

            function cancelChangePassword(){
                document.getElementById("changeProfilePassword").setAttribute("hidden", true);
                document.getElementById("cancel-change-password").style.display = "none";
                document.getElementById("edit-profile").style.display = "inline-block";
                document.getElementById("change-password").style.display = "inline-block";
                document.getElementById("show-name").style.display = "inline-block";
                document.getElementById("show-email").style.display = "inline-block";
            }

            function currentPasswordVisibility() {
                document.getElementById("currentPasswordVisible").style.display = "none";
                document.getElementById("currentPasswordInvisible").style.display = "inline-block";
                document.getElementById("currentPassword").setAttribute("type", "password");
            }

            function currentPasswordInvisibility() {
                document.getElementById("currentPasswordInvisible").style.display = "none";
                document.getElementById("currentPasswordVisible").style.display = "inline-block";
                document.getElementById("currentPassword").setAttribute("type", "text");
            }

            function newPasswordVisibility() {
                document.getElementById("newPasswordVisible").style.display = "none";
                document.getElementById("newPasswordInvisible").style.display = "inline-block";
                document.getElementById("newPassword").setAttribute("type", "password");
            }

            function newPasswordInvisibility() {
                document.getElementById("newPasswordInvisible").style.display = "none";
                document.getElementById("newPasswordVisible").style.display = "inline-block";
                document.getElementById("newPassword").setAttribute("type", "text");
            }

            function reTypeNewPasswordVisibility() {
                document.getElementById("reTypeNewPasswordVisible").style.display = "none";
                document.getElementById("reTypeNewPasswordInvisible").style.display = "inline-block";
                document.getElementById("reTypeNewPassword").setAttribute("type", "password");
            }

            function reTypeNewPasswordInvisibility() {
                document.getElementById("reTypeNewPasswordInvisible").style.display = "none";
                document.getElementById("reTypeNewPasswordVisible").style.display = "inline-block";
                document.getElementById("reTypeNewPassword").setAttribute("type", "text");
            }

            function validateName(input) {
                var regex = /^[a-zA-Z\s]*$/; // Allow letters and spaces only
          
                if (!regex.test(input.value)) {
                  // If the input contains characters not matching the regex, remove them
                  input.value = input.value.replace(/[^a-zA-Z\s]/g, '');
                }
            }