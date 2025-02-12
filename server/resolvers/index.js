import { GraphQLError } from 'graphql'
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import User from '../models/User.js'
import createToken from '../utils/CreateToken.js'
import UserProfile from '../models/UserProfile.js'
import checkRole from '../utils/checkRole.js'
import Project from '../models/Project.js'
import Task from '../models/Task.js'

const resolvers = {
    Query: {
      getProfile: async (root, args, {currUser, token}) => {
          
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
            email: currUser.email,
            phoneNumber: currUser.phoneNumber,
            userProfile: currUser.userProfile,
          };

      },
      fullProfile: async (root, args, {currUser, token}) => {
          
        if (!currUser) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
              message: "Unauthorized: Invalid token"
            }
          })
        }

        const { userProfileData } = args;
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
      getProject: async (root, args, {currUser, token}) => {

        if (!currUser) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
              message: "Unauthorized: Invalid token"
            }
          })
        }

        if (!checkRole([0, 1], currUser.role)) {
          throw new GraphQLError('not authorized', {
            extensions: {
              code: 'BAD_USER_INPUT',
              message: "Unauthorized: Invalid role"
            }
          })
        }

        const { id } = args;

        try {
          const project = await Project.findById(id).populate("tasks");

          if (!project) {
            throw new GraphQLError('Request failed', {
              extensions: {
                code: 'project not found',
              }
            })
          }

          return { success: true, project };
        } catch (error) {
          throw new GraphQLError('Request failed', {
            extensions: {
              code: 'server error',
            }
          })
        }
        
      },
      getAllProject: async (root, args, {currUser, token}) => {

        if (!currUser) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
              message: "Unauthorized: Invalid token"
            }
          })
        }

        if (!checkRole([0, 1], currUser.role)) {
          throw new GraphQLError('not authorized', {
            extensions: {
              code: 'BAD_USER_INPUT',
              message: "Unauthorized: Invalid role"
            }
          })
        }

        const { name, status } = args;

        try {
      
          let filters = {};
      
          if (name) {
            filters.name = new RegExp(name, "i"); // Use regex for case-insensitive search
          }
          if (status) {
            filters.status = status;
          }
      
          const projects = await Project.find(filters).populate("tasks", "name");
          if (!projects) {
            throw new GraphQLError('Request failed', {
              extensions: {
                code: 'projects not found',
              }
            })
          }
      
          if (!projects.length) {
            throw new GraphQLError('Request failed', {
              extensions: {
                code: 'projects not found with a given filter',
              }
            })
          }
      
          return { success: true, projects };
        } catch (error) {
          throw new GraphQLError('Request failed', {
            extensions: {
              code: 'server error',
              error
            }
          })
        }
        
      },
      getTask: async (root, args, {currUser, token}) => {

        if (!currUser) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
              message: "Unauthorized: Invalid token"
            }
          })
        }

        if (!checkRole([0, 1], currUser.role)) {
          throw new GraphQLError('not authorized', {
            extensions: {
              code: 'BAD_USER_INPUT',
              message: "Unauthorized: Invalid role"
            }
          })
        }

        const { id } = args;

        try {
          const task = await Task.findById(id).populate("project", "name");

          if (!task) {
            throw new GraphQLError('Request failed', {
              extensions: {
                code: 'task not found',
              }
            })
          }

          return { success: true, task };
        } catch (error) {
          throw new GraphQLError('Request failed', {
            extensions: {
              code: 'server error',
              error
            }
          })
        }
      },
      getAllTask: async (root, args, {currUser, token}) => {

        if (!currUser) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
              message: "Unauthorized: Invalid token"
            }
          })
        }

        if (!checkRole([0, 1], currUser.role)) {
          throw new GraphQLError('not authorized', {
            extensions: {
              code: 'BAD_USER_INPUT',
              message: "Unauthorized: Invalid role"
            }
          })
        }

        const { name, project } = args;

        try {
          let filters = {};
      
          if (name) {
            filters.name = new RegExp(name, "i");
          }
          if (project) {
            filters.project = project;
          }
      
          const tasks = await Task.find(filters).populate("project", "name");
          let count = tasks.length;
      
          if (!tasks) {
             throw new GraphQLError('Request failed', {
              extensions: {
                code: 'tasks not found',
              }
            })
          }
          if (!tasks.length) {
            throw new GraphQLError('Request failed', {
              extensions: {
                code: 'tasks not found with given filter',
              }
            })
          }
      
          return { success: true, count, tasks };
        } catch (error) {
          throw new GraphQLError('Request failed', {
            extensions: {
              code: 'server error',
              error
            }
          })
        }
      },
    },
    Mutation: {
        register: async (root, args, {currUser, token}) => {
            
              const { email, password, phoneNumber } = args;

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
        verifyEmail: async (root, args, {token, currUser}) => {

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
        login: async (root, args, {token, currUser}) => { 
          const { identifier, password } = args;

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
        logout: async (root, args, {currUser, token}) => { 

          if (!currUser) {
            throw new GraphQLError('not authenticated', {
              extensions: {
                code: 'BAD_USER_INPUT',
                message: "Unauthorized: Invalid token"
              }
            })
          }

          // I think log out should be enough on the front
          return "Logged out"

        },
        forgotPassword: async (root, args, {currUser, token}) => { 
          const { email } = args;

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
        VerifyReturn: async (root, args, {currUser, token}) => { 
          const { email, code, newPassword } = args;

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
        setProfile: async (root, args, {currUser, token}) => {

          if (!currUser) {
            throw new GraphQLError('not authenticated', {
              extensions: {
                code: 'BAD_USER_INPUT',
                message: "Unauthorized: Invalid token"
              }
            })
          }

          const { userData } = args;
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
        createProject: async (root, args, {currUser, token}) => {

          if (!currUser) {
            throw new GraphQLError('not authenticated', {
              extensions: {
                code: 'BAD_USER_INPUT',
                message: "Unauthorized: Invalid token"
              }
            })
          }

          if (!checkRole([0, 1], currUser.role)) {
            throw new GraphQLError('not authorized', {
              extensions: {
                code: 'BAD_USER_INPUT',
                message: "Unauthorized: Invalid role"
              }
            })
          }

          const {
            name,
            description,
            startDate,
            deadLine,
            status,
            budget,
            client,
            projectManagers,
            payment,
          } = args.newProject;

          try {
            const project = new Project({
              name,
              description,
              startDate,
              deadLine,
              status,
              budget,
              client,
              projectManagers,
              payment,
            });
        
            await project.save();
        
            return { success: true, project };
          } catch (err) {
            console.error(err);
            throw new GraphQLError('Project creation failed', {
              extensions: {
                code: 'server error',
                err
              }
            })
          }

        },
        createTask: async (root, args, {currUser, token}) => {

          if (!currUser) {
            throw new GraphQLError('not authenticated', {
              extensions: {
                code: 'BAD_USER_INPUT',
                message: "Unauthorized: Invalid token"
              }
            })
          }

          if (!checkRole([0, 1], currUser.role)) {
            throw new GraphQLError('not authorized', {
              extensions: {
                code: 'BAD_USER_INPUT',
                message: "Unauthorized: Invalid role"
              }
            })
          }

          const {
            name,
            description,
            startDate,
            deadLine,
            status,
            budget,
            documents,
            team,
            projectId,
          } = args.newTask;

          try {
            // Check if the project exists
            const project = await Project.findById(projectId);
            if (!project) {
              throw new GraphQLError('Request failed', {
                extensions: {
                  code: 'project not found',
                }
              })
            }
        
            // Create a new task
            const task = new Task({
              name,
              description,
              startDate,
              deadLine,
              status,
              budget,
              documents,
              team,
              project: projectId,
            });
        
            // Save the new task to the database
            await task.save();
        
            // Push the new task ID to the project.tasks array
            await Project.findByIdAndUpdate(projectId, { $push: { tasks: task._id } });
        
            // Send a response with the new task data
            return { success: true, task };
          } catch (error) {
            console.error(error);
            throw new GraphQLError('Project creation failed', {
              extensions: {
                code: 'server error',
                error
              }
            })
          }
        }       
    }
}

export default resolvers