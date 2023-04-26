import { GraphQLError } from ('graphql') 
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import User from '../models/User.js'
import createToken from '../utils/CreateToken.js'
import UserProfile from '../models/UserProfile.js'
import checkRole from '../utils/checkRole.js'

const resolvers = {
    Query: {},
    Mutation: {
        register: async (root, args, {currUser, body}) => {
            
              const { email, password, phoneNumber } = body;

              try {
                const user = await User.register(email, password, phoneNumber);
            
                // send email verification
                const verificationToken = jwt.sign(
                  { email: user.email },
                  process.env.JWT_SECRET,
                  { expiresIn: "1h" }
                );
                user.verificationToken = verificationToken;
                user.verificationTokenExpiration = Date.now() + 60 * 60 * 1000; // 1 hour
            
                // send verification email
                const transporter = nodemailer.createTransport({
                  service: "Gmail",
                  auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD,
                  },
                });
                const mailOptions = {
                  from: process.env.EMAIL_USERNAME,
                  to: user.email,
                  subject: "Email verification for your account",
                  html: `Please click this link to verify your email address: <a href="${process.env.BASE_URL}/api/v1/verify-email?token=${verificationToken}">Verify Email</a>`,
                };
                transporter.sendMail(mailOptions, (err, info) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(info);
                  }
                });
                await user.save();
            
                return {
                  success: true,
                  user: user,
                  message: "Account Created",
                };

              } catch (error) {
                 throw new GraphQLError('registration failed', {
                  extensions: {
                    code: 'BAD_USER_INPUT',
                    error
                  }
                })
              }
        },
        verify_email: async (root, args, {token, body}) => {

          try {
            // Find user with matching verification token
            const user = await User.findOne({
              verificationToken: token,
              verificationTokenExpiration: { $gt: Date.now() },
            });
        
            if (!user) {
              throw new GraphQLError('Verification failed', {
                extensions: {
                  code: 'Invalid or expired verification token.',
                }
              })
            }
        
            // Set user as verified
            user.isEmailVerified = true;
            user.verificationToken = "";
            user.verificationTokenExpiration = null;
            await user.save();
        
            return {
              success: true,
              message: "Account verified successfully.",
            };

          } catch (error) {
            console.log(error);
            throw new GraphQLError('Verification failed', {
                extensions: {
                  code: 'Server error while verifying account.',
                  error
                }
              })
          }

        },
        login: async (root, args, {token, body}) => { 
          const { identifier, password } = body;

          try {
            const user = await User.login(identifier, password);
            if (!user) {
              throw new GraphQLError('Authentication failed', {
                extensions: {
                  code: 'Invalid credential'                }
              })
            }

            const token = createToken(user._id);

            return {
              success: true,
              message: "Successfully logged in",
              token,
            };

          } catch (error) {
            throw new GraphQLError('Authentication failed', {
                extensions: {
                  code: 'Server error while authenticating user.',
                  error
                }
              })
          }
        },
        logout: async (root, args, {currUser, token, body}) => { 

          if (!currUser) {
            throw new GraphQLError('not authenticated', {
              extensions: {
                code: 'BAD_USER_INPUT',
                message: "Unauthorized: Invalid token"
              }
            })
          }

          // I think log out should be enough on the front

        },
        forgot_passwordasync: async (root, args, {currUser, token, body}) => { 
          const { email } = body;

          try {
            const code = await User.forgotPassword(email);

            const transporter = nodemailer.createTransport({
              service: "Gmail",
              auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
              },
            });

            const mailOptions = {
              from: process.env.EMAIL_USERNAME,
              to: email,
              subject: "Forgot Password",
              html: `Your verification code is ${code}`,
            };

            await transporter.sendMail(mailOptions);

          } catch (error) {
            throw new GraphQLError('Process failed', {
              extensions: {
                code: 'server failed when executing the task',
                error
              }
            })
          }

          return {
            success: true,
            message: "Verification code sent to email",
          };

        },
        reset_password: async (root, args, {currUser, token, body}) => { 
          const { email, code, newPassword } = body;

          try {
            const user = await User.findOne({ email });

            if (!user) {
              throw new GraphQLError('User not found', {
                extensions: {
                  code: 'invalid email. user not found'                }
              })
            }

            if (user.resetPasswordCode !== code) {
              throw new GraphQLError('Reset failed', {
                extensions: {
                  code: 'invalid verification code.'                }
              })
            }

            await User.resetPassword(email, code, newPassword);

          } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
          }

          return { 
            success: true, 
            message: "Password reset successful" 
            };

        },
        get_profile: async (root, args, {currUser, token, body}) => {
          
          if (!currUser) {
            throw new GraphQLError('not authenticated', {
              extensions: {
                code: 'BAD_USER_INPUT',
                message: "Unauthorized: Invalid token"
              }
            })
          }

          return {
              success: true,
              data: {
                email: currUser.email,
                phoneNumber: currUser.phoneNumber,
                userProfile: currUser.userProfile,
              }
            };

        },
        set_profile: async (root, args, {currUser, token, body}) => {

          if (!currUser) {
            throw new GraphQLError('not authenticated', {
              extensions: {
                code: 'BAD_USER_INPUT',
                message: "Unauthorized: Invalid token"
              }
            })
          }

          const { userData } = body;
          const userId = currUser._id;

          try {
            // Find the user by ID and update their user data
            const updatedUser = await User.findByIdAndUpdate(userId, userData, {
              new: true,
              runValidators: true,
            });

          return { user: updatedUser };

          } catch (error) {
            console.error(error);
            throw new GraphQLError('Profile set failed', {
              extensions: {
                code: 'server error',
                error
              }
            })
          }
        },
        full_profile: async (root, args, {currUser, token, body}) => {
          
          if (!currUser) {
            throw new GraphQLError('not authenticated', {
              extensions: {
                code: 'BAD_USER_INPUT',
                message: "Unauthorized: Invalid token"
              }
            })
          }

          const { userProfileData } = body;
          const userId = currUser._id;

          try {
            // Find the userProfile for the user and update it
            const updatedUserProfile = await UserProfile.findOneAndUpdate(
              { user: userId },
              { $set: userProfileData },

              {
                new: true,
                upsert: true,
                runValidators: true,
              }
            ).populate("user");

            return { userProfile: updatedUserProfile };
            
          } catch (error) {
            console.error(error);
            throw new GraphQLError('Profile set failed', {
              extensions: {
                code: 'server error',
                error
              }
            })
          }
        },
        create_project: async (root, args, {currUser, token, body}) => {

          if (!currUser) {
            throw new GraphQLError('not authenticated', {
              extensions: {
                code: 'BAD_USER_INPUT',
                message: "Unauthorized: Invalid token"
              }
            })
          }


        }
    }
}

export default resolvers