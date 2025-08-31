const pool = require('./db');

async function checkSchema() {
    try {
        console.log('Checking macromolecule table schema...');
        
        // Check table structure
        const schemaResult = await pool.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'macromolecule' 
            ORDER BY ordinal_position
        `);
        
        console.log('Macromolecule table columns:');
        schemaResult.rows.forEach(row => {
            console.log(`- ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
        });
        
        // Check sample data
        const dataResult = await pool.query('SELECT * FROM macromolecule LIMIT 3');
        console.log('\nSample data:');
        console.log(dataResult.rows);
        
        // Check if there's an auto-increment ID
        const pkResult = await pool.query(`
            SELECT a.attname
            FROM pg_index i
            JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
            WHERE i.indrelid = 'macromolecule'::regclass AND i.indisprimary;
        `);
        
        console.log('\nPrimary key columns:');
        pkResult.rows.forEach(row => {
            console.log(`- ${row.attname}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkSchema();
