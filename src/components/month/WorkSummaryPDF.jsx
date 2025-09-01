import { useState, useEffect } from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { getCurrentMonthShifts } from '../routes/ShiftRoutes';


const styles = StyleSheet.create({
    page: {
        backgroundColor: '#ffffff',
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
      },
    month: {
        fontSize: 20,
        marginBottom: 20,
        fontWeight: 600
    },
    view: {
        display: 'flex',
        flexDirection: 'row'
    },
    seperator: {
        margin: '0 5px'
    },
    left: {
        marginLeft: '5px'
    },
    up: {
        marginTop: '10px'
    }
})

const WorkSummaryPDF = () => {

    const [month, setMonth] = useState(() => {
        const date = new Date();
        return date.toLocaleString('default', { month: 'long' });
    })
    const [shifts, setShifts] = useState([])
    const [total, setTotal] = useState(0)


    const fetchShifts = async () => {
        try{
            const response = await getCurrentMonthShifts()
            setShifts(response)
            setTotal(response.reduce((acc, shift) => acc + parseFloat(shift.hours), 0))
        } catch(e) {
            console.log(e)
        }
       
    }

    useEffect(() => {
        fetchShifts()
    }, [])

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}`;
    };
    

    const formatTime = (time) => {
        return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }


    return (

        <>
        <Document>
            <Page size='A4' style={styles.page}>
                <Text style={styles.month}>{month}</Text>
                {shifts
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((shift, i) => (
                    <>
                    <View key={i} style={styles.view}>
                        <Text>{formatDate(shift.date)}</Text>
                        <Text style={styles.seperator}>|</Text>
                        <Text>{formatTime(shift.start_time)}</Text>
                        <Text style={styles.seperator}>-</Text>
                        <Text>{formatTime(shift.finish_time)}</Text>
                        <Text style={styles.left}>({shift.hours} hours)</Text>
                    </View>
                    </>
                ))}
                <Text style={styles.up}>Total: {total} hours</Text>
            </Page>
        </Document>
        
        
        </>
    )
}


export default WorkSummaryPDF