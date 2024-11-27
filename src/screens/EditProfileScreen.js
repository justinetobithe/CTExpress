import React from 'react'
import { Text, View } from 'react-native'

export default function EditProfileScreen() {
    return (
        <View>
            <Text>Text</Text>
        </View>
    )
}


// import React, { useContext, useState } from 'react'
// import { Text, ScrollView } from 'react-native'
// import Layout from '../components/Layout'
// import { FormControl, Input, Image, Center, Button, } from "native-base";
// import { AuthContext } from '../context/AuthContext';

// export default function EditProfileScreen({ navigation }) {

//     const { userInfo, updateUser } = useContext(AuthContext)
//     const [currentPassword, setCurrentPassword] = useState("")
//     const [newPassword, setNewPassword] = useState("")
//     const [confirmPassword, setConfirmPassword] = useState("")


//     const onUpdate = () => {
//         if (newPassword == "") {
//             console.log("Password cannot be blank!")
//         } else if (currentPassword == "") {
//             console.log("Password cannot be blank!")
//         } else if (confirmPassword == "") {
//             console.log("Confirm Password cannot be blank!")
//         } else if (newPassword != confirmPassword) {
//             console.log("Password does not match!")
//         } else {
//             updateUser(userInfo.user.id, currentPassword, newPassword, confirmPassword)
//         }
//     }

//     return (
//         <ScrollView>
//             <Layout>
//                 <Center>
//                     <FormControl isInvalid mb="4">
//                         <Center>
//                             <Image size={150} borderRadius={100} source={require('../assets/img/avatar.png')} alt="Alternate Text" />
//                         </Center>
//                     </FormControl>
//                     <FormControl isInvalid mb="4">
//                         <FormControl.Label mb="2">Email</FormControl.Label>
//                         <Input defaultValue={userInfo.user.email} isDisabled={true} />
//                     </FormControl>
//                     <FormControl isInvalid mb="4">
//                         <FormControl.Label mb="2">Name</FormControl.Label>
//                         <Input defaultValue={userInfo.user.name} isDisabled={true} />
//                     </FormControl>
//                     <FormControl isInvalid mb="4">
//                         <FormControl.Label mb="2">Current Pasword</FormControl.Label>
//                         <Input
//                             value={currentPassword.value}
//                             onChangeText={(text) => setCurrentPassword(text)}
//                             autoCapitalize="none"
//                             secureTextEntry
//                         />
//                     </FormControl>
//                     <FormControl isInvalid mb="4">
//                         <FormControl.Label mb="2">New Password</FormControl.Label>
//                         <Input
//                             value={newPassword.value}
//                             onChangeText={(text) => setNewPassword(text)}
//                             autoCapitalize="none"
//                             secureTextEntry
//                         />
//                     </FormControl>
//                     <FormControl isInvalid mb="4">
//                         <FormControl.Label mb="2">Confirm Password</FormControl.Label>
//                         <Input
//                             value={confirmPassword.value}
//                             onChangeText={(text) => setConfirmPassword(text)}
//                             autoCapitalize="none"
//                             secureTextEntry
//                         />
//                     </FormControl>
//                     <FormControl isInvalid mb="4">
//                         <Button style={{ backgroundColor: '#080E2C' }} mt="2" onPress={onUpdate}>
//                             <Text style={{ color: '#fff' }}>Update</Text>
//                         </Button>
//                     </FormControl>
//                 </Center>
//             </Layout>
//         </ScrollView>
//     )
// } 